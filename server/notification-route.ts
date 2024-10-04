/* eslint-disable import/no-unresolved */
import { t } from "@/utils/trpc-server";
import { string, z } from "zod";
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { placeSchema } from "@/lib/form-schema";

const notificationRouter = t.router({
  getNotifications: t.procedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }))
    .query(async ({ input }) => {
      const notifications = await prisma.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          locations: true,
        },
        take: input.limit || 10, // Default limit to 10 if not provided
      });

      return {
        status: "success",
        unread: notifications.filter((notification) => !notification.read)
          .length,
        notifications,
      };
    }),
  markAsRead: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const updatedNotification = await prisma.notification.update({
          where: { id: input.id },
          data: { read: true },
        });
        return { status: "success", notification: updatedNotification };
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }
    }),

  markAllAsRead: t.procedure.mutation(async () => {
    try {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
      return { status: "success" };
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
    }
  }),

  addLocationWithNotification: t.procedure
    .input(
      z.object({
        place: z.any(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const email = input.email;

      console.log("Adding Place: ");
      console.log("Email: ", email);
      console.log("Place: ", input.place);

      let existingLocation = null;

      if (input.place.id) {
        const existingLocation = await prisma.location.findUnique({
          where: {
            id: input.place.id as number,
          },
        });
      }
      // Check if the location already exists

      let newLocation;

      if (input.place.id && existingLocation) {
        // Update the existing location
        newLocation = await prisma.location.update({
          where: {
            id: existingLocation.id,
          },
          data: {
            name: input.place.name,
            latitude: Number(input.place.latitude),
            longitude: Number(input.place.longitude),
            geojson: input.place.geojson,
            user: {
              connect: {
                email,
              },
            },
          },
        });

        // Delete existing notifications for the location
        await prisma.notification.deleteMany({
          where: {
            id: existingLocation.id,
          },
        });
      } else {
        // Create a new location
        newLocation = await prisma.location.create({
          data: {
            name: input.place.name,
            latitude: Number(input.place.latitude),
            longitude: Number(input.place.longitude),
            geojson: input.place.geojson,
            user: {
              connect: {
                email,
              },
            },
          },
        });
      }

      // Add new notifications
      for (const notification of input.place.notifications) {
        await prisma.notification.create({
          data: {
            satellite: notification.satellite,
            notifyBefore: Number(notification.notifyBefore),
            notifyIn: notification.notifyIn.toUpperCase(),
            smsNumber: notification.smsNumber,
            email: notification.email,
            locations: {
              connect: {
                id: newLocation.id,
              },
            },
            user: {
              connect: {
                email,
              },
            },
          },
        });
      }

      return { status: "success", location: newLocation };
    }),

  onNewNotification: t.procedure.subscription(() => {
    return observable<{ id: string; message: string }>((emit) => {
      const onNotification = (notification: {
        id: string;
        message: string;
      }) => {
        emit.next(notification);
      };

      // send random notifications every 5 seconds
      const interval = setInterval(() => {
        onNotification({
          id: Math.random().toString(),
          message: "New notification",
        });
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    });
  }),
});

export default notificationRouter;
