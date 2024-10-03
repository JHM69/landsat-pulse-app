import axios from "axios";
import prisma from "@/prisma/prisma-client";
import { getESTDateRange } from "@/lib/utils";

type StockDataType = {
  symbol: string;
  change: number;
  price: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  version?: number;
  changeWithLastDay: number;
  timestamp: number;
  pre_processing_data: any;
};

let results: StockDataType[] = [];
let monitoringStocks: any[] = [];
let monitoringInterval: NodeJS.Timeout | null = null;
let refresh_time_seconds = 300;
let thresholdPercentage = 50;

const apiKey = process.env.FMP_API_KEY;
const stockCache: Record<string, StockDataType> = {};
const pre_processing_datas = [];

const fetchStockData = async (stocks: any[]): Promise<StockDataType[]> => {
  try {
    const symbols = stocks.map(stock => stock.symbol);
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=${apiKey}`
    );

    return response.data.map((stock: any) => ({
      symbol: stock.symbol,
      price: stock.price,
      change: calculatePercentageChange(stockCache[stock.symbol]?.price ?? 0, stock.price),
      changeWithLastDay: stock.changesPercentage,
      open: stock.open,
      close: stock.close,
      high: stock.high,
      low: stock.low,
      volume: stock.volume,
      timestamp: Date.now(), 
      reason : stocks.find(s => s.symbol === stock.symbol)?.reason,
      last_updated: stocks.find(s => s.symbol === stock.symbol)?.last_updated,

    }));
  } catch (error) {
    console.error(`Failed to fetch data: ${error?.message}`);
    return [];
  }
};

const calculatePercentageChange = (oldPrice: number, newPrice: number): number => {
  return oldPrice === 0 ? 0 : ((newPrice - oldPrice) / oldPrice) * 100;
};

let v = 1;

async function monitorStocks() {
  const niceStocks: string[] = [];

  try {
    const newDataArray = await fetchStockData(monitoringStocks); 
    newDataArray.forEach(newData => {
      newData.version = v++;
      stockCache[newData.symbol] = newData;
      stockCache[newData.symbol].pre_processed_data = getOrFetchPreProcessedData(newData.symbol);
      results.push(newData);

      if (newData.change >= thresholdPercentage) {
        niceStocks.push(newData.symbol);
      } else if (newData.change === Infinity) {
        prisma.notification.create({
          data: {
            message: `<b>${newData.symbol}</b> has been removed from monitoring`,
            type: "Add",
          },
        });
      }
    });

    results.sort((a, b) => b.change - a.change);

    if (niceStocks.length > 0) {
      await prisma.notification.create({
        data: {
          message: `<b>${niceStocks.join(", ")}</b> have increased by more than ${thresholdPercentage}% in the last ${(refresh_time_seconds / 60).toFixed(1)} minutes`,
          type: "Stock",
        },
      });
    }
  } catch (error) {
    console.error(`Error in monitorStocks: ${error.message}`);
  }
}





const getOrFetchPreProcessedData = async (symbol: string) => {
  // Check if we have the data in cache
  if (pre_processing_datas[symbol]){
    return pre_processing_datas[symbol];
  }else{
    // Fetch the data from prisma
    const data = await prisma.pre_processing_data.findFirst({
      where: {
        symbol: symbol,
      },
    }); 
    // Store the data in cache
    pre_processing_datas[symbol] = data;
    return data;
  }
}

const initialFetch = async () => {
  const initialData = await fetchStockData(monitoringStocks);
  initialData.forEach(data => {
    stockCache[data.symbol] = data;
    stockCache[data.symbol].pre_processing_data = getOrFetchPreProcessedData(data.symbol);
    results.push(data);
  });

};

export const startMonitoring = async (
  refresh_time_secondsIn = 300,
  thresholdPercentageIn = 50,
  from: string,
  to: string
) => {
  refresh_time_seconds = refresh_time_secondsIn;
  thresholdPercentage = thresholdPercentageIn;
  results = [];

  const where = new Map<string, any>();
  
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    const fromRange = getESTDateRange(fromDate);
    const toRange = getESTDateRange(toDate);
  
    where.set("last_updated", {
      gte: fromRange.start.toISOString().split('T')[0],
      lte: toRange.end.toISOString().split('T')[0],
    });
  } else if (from) {
    const fromDate = new Date(from);
    const fromRange = getESTDateRange(fromDate);
  
    where.set("last_updated", {
      gte: fromRange.start.toISOString().split('T')[0],
    });
  } else if (to) {
    const toDate = new Date(to);
    const toRange = getESTDateRange(toDate);
  
    where.set("last_updated", {
      lte: toRange.end.toISOString().split('T')[0],
    });
  }

  
  monitoringStocks = await prisma.observingstocks.findMany({
    where: {
      AND: [
        ...Array.from(where).map(([key, value]) => ({
          [key]: value,
        })),
      ],
    },
    select: {
      symbol: true,
      reason: true,
      last_updated: true,
      id: true, 
    }
  });

  
  if (Object.keys(stockCache).length === 0) {
    await initialFetch();
  } else {
    await monitorStocks();
  }

  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  monitoringInterval = setInterval(monitorStocks, refresh_time_seconds * 1000);

  return results;
};