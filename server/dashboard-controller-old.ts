/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import prisma from "@/prisma/prisma-client";
import { TRPCError } from "@trpc/server"; 
import { FilterQueryInput } from "./dashboard-schema";
import { orders } from "@prisma/client"; 
import axios from "axios";
import { getESTDateRange } from "@/lib/utils";

interface StockData {
  price: number;
  lastUpdated: number;
}

let stockPrices = new Map<string, StockData>();


const FMP_API_KEY = '2vpTWrRYP8XvriGjkXX9fG2zZtP009mQ'


async function getCurrentStockPrice(stockSymbol: string): Promise<number> {
  const url = `https://financialmodelingprep.com/api/v3/quote/${stockSymbol}?apikey=${FMP_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    console.log("Stock Price: ", data[0].price);
    return data[0].price;
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return 0;
  }
}

async function updateStockPrices(stocks: string[]) {
  const currentTime = Date.now();

  await Promise.all(stocks.map(async (stockSymbol) => {
    const stockData = stockPrices.get(stockSymbol);

    if (!stockData || currentTime - stockData.lastUpdated >= 60000) {
      const stockPrice = await getCurrentStockPrice(stockSymbol);
      stockPrices.set(stockSymbol, { price: stockPrice, lastUpdated: currentTime });
      console.log(`Updated ${stockSymbol}: ${stockPrice}`);
    } else {
      console.log(`Skipped ${stockSymbol}: Last update was less than 60 seconds ago`);
    }
  }));
}
 
function getStockPrice(stockSymbol: string): number {
  const stockData = stockPrices.get(stockSymbol);
  return stockData ? stockData.price : 0;
}
 
function calculateSumAndExtra(orderList: orders[]): { sum: number; extra: number , qty: number, stock_price: number, count: number } {                                                                
  let lastNegativeIndex = -1;
   
  orderList.forEach((order, index) => {
    if (parseFloat(order.amount) < 0) {
      lastNegativeIndex = index;
    }
  });

  return orderList.reduce(
    (acc, order, index) => {  
      const amount = parseFloat(order.amount);
      if (amount < 0) {
        acc.sum += amount;
      } else if (index <= lastNegativeIndex) {
        acc.sum += amount;
      } else if (amount > 0) {  
        acc.count += 1;
        acc.qty += Number(order.filled_qty);
        acc.stock_price += Number(order.stock_price) * Number(order.filled_qty); 
        acc.extra += Number(order.filled_qty) * (  getStockPrice(order.symbol as string)  - Number(order.stock_price) );
      }

      return acc;
    },
    { sum: 0, extra: 0, qty: 0, stock_price: 0, count : 0 }
  );
}


function calculateSumAndExtraFromAll(orderList: orders[], stockSymbols : any[]): { sum: number; extra: number  , qty: number, stock_price: number, count: number } {
  let sum = 0;
  let extra = 0;
  let count = 0;
  let qty = 0;
  let stock_price = 0;
 
  stockSymbols.forEach((stockSymbol) => {
    const orders = orderList.filter((order) => order.symbol === stockSymbol);
    const { sum: stockSum, extra: stockExtra, qty: stockQty, stock_price: stockPrice, count: stockCount } = calculateSumAndExtra(orders);
    sum += stockSum;
    extra += stockExtra;
    qty += stockQty;
    stock_price += (stockPrice * stockQty);
    count += stockCount; 
  }); 
 
  return { sum, extra , qty, stock_price, count };
}



export const getDashboardHandler = async ({
  filterQuery,
}: {
  filterQuery: FilterQueryInput;
}) => {
  try {
    const { limit, page, env } = filterQuery;
  
    const skip = (page - 1) * limit;

    const from = filterQuery.from;
    const to = filterQuery.to;

    const symbol = filterQuery.symbol;

    const comment = filterQuery.comment;

    const where = new Map<string, any>();

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      
      const fromRange = getESTDateRange(fromDate);
      const toRange = getESTDateRange(toDate);
    
      where.set("created_at", {
        gte: fromRange.start.toISOString().split('T')[0],
        lte: toRange.end.toISOString().split('T')[0],
      });
    } else if (from) {
      const fromDate = new Date(from);
      const fromRange = getESTDateRange(fromDate);
    
      where.set("created_at", {
        gte: fromRange.start.toISOString().split('T')[0],
      });
    } else if (to) {
      const toDate = new Date(to);
      const toRange = getESTDateRange(toDate);
    
      where.set("created_at", {
        lte: toRange.end.toISOString().split('T')[0],
      });
    }

    
    if (symbol) {
      where.set("symbol", {
        equals: symbol,
      });
    }

    if (symbol === "All Stocks") {
      where.delete("symbol");
    }

    if (comment) {
      where.set("comment", {
        contains: comment,
      });
    }
    // skips those with comment "Initial Trade"
    where.set("comment", {
      not: {
        equals: "Initial Trade",
      },
    });

    let orders = [];
    if (env === 'backtest') {
      orders = await prisma.backtestorders.findMany({
        where: Object.fromEntries(where),
        skip, 
        orderBy: {
          created_at: "asc",
        },  
      });
    }else{
        orders = await prisma.orders.findMany({
        where: Object.fromEntries(where),
        skip, 
        orderBy: {
          created_at: "asc"
        },  
      });
    }


   

    const total_orders = orders.length;
    const order_cost = total_orders * 0.001

  

    const stockSymbols = new Set<string>();

    stockSymbols.add("All Stocks");
  
    orders.forEach((order) => {
      stockSymbols.add(order.symbol as string);
    });

    const total_stock_symbols = stockSymbols.size - 1;

    const stocks =  Array.from(stockSymbols);

    updateStockPrices(stocks); 

    const {sum, extra , qty, stock_price }= symbol === "All Stocks" ? calculateSumAndExtraFromAll(orders, stocks) : calculateSumAndExtra(orders) 

    console.log("Qty: ", qty);

    const active_orders = orders.filter((order) => order?.status === "active").length;


    // convert orders created_at to EST timezone
    orders.forEach((order) => {
      order.created_at = new Date(order.created_at).toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
    });

  
 
    return {
      status: "success",
      results: orders.length,
      data: {
        stockSymbols:stocks,
        total_profit : sum,
        total_profit_ur : extra,
        total_orders, 
        live_qty : qty,
        live_price : stock_price / qty,
        order_cost,
        stockPrices,
        total_stock_symbols,
        active_orders,
        orders, 
      },
    };


  } catch (err: any) {
    console.log(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
