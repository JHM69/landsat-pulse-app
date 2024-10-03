import { filterQuery } from './order-schema';
import { getOrderHandler } from './order-controller';
import { t } from '@/utils/trpc-server';
import prisma from "@/prisma/prisma-client";


const stockRouter = t.router({
  getStocks: t.procedure
    .query(async () => {
      const stocks = await prisma.stock.findMany();
      return {
        status: "success",
        results: stocks.length,
        data: {
          stocks,
        },
      };
    }),
});



export default stockRouter;
