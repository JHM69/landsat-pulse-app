/* eslint-disable import/no-unresolved */
import { t } from "@/utils/trpc-server";
import { z } from "zod";
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server";
import { observable } from '@trpc/server/observable';

const notificationRouter = t.router({

  getNotifications: t.procedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }))
    .query(async ({ input }) => {
      const notifications = await prisma.notification.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit || 10,  // Default limit to 10 if not provided
      });
  
      return {
        status: "success", 
        unread: notifications.filter((notification) => !notification.read).length,
        notifications,
      };
    }
  ),
  markAsRead: t.procedure
    .input(z.object({ id: z.string() }))
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

  onNewNotification: t.procedure.subscription(() => {
    return observable<{ id: string; message: string }>((emit) => {
      const onNotification = (notification: { id: string; message: string }) => {
        emit.next(notification);
      }; 

      // send random notifications every 5 seconds 
      const interval = setInterval(() => {
        onNotification({ id: Math.random().toString(), message: "New notification" });
      }, 5000);
       
      return () => {
        clearInterval(interval);
      }
       
    });
  }),
});

export default notificationRouter;
