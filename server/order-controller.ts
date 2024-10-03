// order-controller.ts
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server";  
import { getPlacesInputSchema } from "./order-route";
import { z } from "zod";

export const getPlacesHandler = async ({
  input,
}: {
  input: z.infer<typeof getPlacesInputSchema>
}) => {
  try {
    const email = input.email; 
    
    const locations = await prisma.location.findMany({ 
      where: {
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return {
      status: "success",
      locations
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
