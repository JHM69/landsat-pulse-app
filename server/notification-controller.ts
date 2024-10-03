/* eslint-disable import/no-unresolved */
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server"; 
 
export const getNotificationsHandler = async (p0: { limit: number; }) => {
  try {

   
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
