/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server";
import { FilterQueryInput } from "./dashboard-schema";  
import NodeCache from "node-cache";
 
const cache = new NodeCache({ stdTTL: 60 });

  

export const getDashboardHandler = async ({ filterQuery }: { filterQuery: FilterQueryInput }) => {
  try {
    
    const { env, from, to, symbol, start_hh = 9, start_mm = 30, end_hh = 16, end_mm = 0 } = filterQuery;

   
    const startOfDay = new Date(from); 
    startOfDay.setUTCHours(start_hh, start_mm, 0, 0);
    const endOfDay = new Date(to); 
    endOfDay.setUTCHours(end_hh + 5, end_mm, 0, 0);
 
    // key will be as MGOL_2024-02-01_2024-02-01_09_30_16_00
    const cacheKey = `${symbol}_${startOfDay.toISOString()}_${endOfDay.toISOString()}_${start_hh}_${start_mm}_${end_hh}_${end_mm}`;
    const cachedResult = cache.get(cacheKey);
 
    if (cachedResult) {
      console.log("Cache hit: sending cached result");
      return cachedResult;
    }else{
      console.log("Cache miss: fetching from database");
    }

 
    const result = {
       
    };  
    cache.set(cacheKey, result); 
    return result;

  } catch (err: any) {
    console.error(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
}




