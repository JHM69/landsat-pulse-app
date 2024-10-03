import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server"; 
import { FilterQueryInput } from "./order-schema";

export const getPlacesHandler = async ({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) => {
  try {
    const { limit, page } = filterQuery;
    const take = limit || 200;
    const skip = (page - 1) * limit;

    const from = filterQuery.from;
    const to = filterQuery.to;

 

    const symbol = filterQuery.symbol;

    const comment = filterQuery.comment;

    const where = new Map<string, any>();

    if (from && to) {
      where.set("created_at", {
          gte: new Date(from).toISOString().split('T')[0],
          lte: new Date(to).toISOString().split('T')[0],
      });
  } else if (from) {
      where.set("created_at", {
          gte: new Date(from).toISOString().split('T')[0],
      });
  } else if (to) {
      where.set("created_at", {
          lte: new Date(to).toISOString().split('T')[0],
      });
  }
    if (symbol) {
      where.set("symbol", {
        equals: symbol,
      });
    }

    if (comment) {
      where.set("comment", {
        contains: comment,
      });
    } 
    const locations = await prisma.location.findMany({
      where: Object.fromEntries(where),
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

 

    return {
      status: "success",
      results: locations.length,
      data: {
        orders, 
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
