"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize,
  bollingerBand,
  BollingerSeries,
  BollingerSeriesProps,
  BollingerBandTooltip,
  RSISeries,
  RSITooltip,
  rsi,
} from "react-financial-charts";

import { LabelAnnotation, Annotate } from "@react-financial-charts/annotations";

import StockTabItem from "./tab-item"; 
import { orders } from "@prisma/client";
import { ArrowUpCircle, ArrowDownCircle, Clock, XCircle } from "lucide-react";
import React from "react";
type StocksProps = {
  date: any;
  stocks: string[];
  onSetActiveStock?: (stock: string) => void;
  stockPrices: Map<string, any>;
  activeStock?: string;
  orders?: orders[];
  start_hh: number;
  start_mm: number;
  end_hh: number;
  end_mm: number;
};

export interface IOHLCData {
  readonly close: number;
  readonly date: Date;
  readonly high: number;
  readonly low: number;
  readonly open: number;
  readonly volume: number;
}
 

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function Stocks({
  date,
  stocks,
  stockPrices,
  orders,
  start_hh,
  start_mm,
  end_hh,
  end_mm,
}: StocksProps) {
  // remove the stock "All Stocks" from the list of stocks
  const stock_length = stocks.length;
  stocks = stocks.filter((stock) => stock !== "All Stocks");
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  const [tabStocks, setTabStocks] = useState<string[]>(stocks);
  const [activeStockTicker, setActiveStock] = useState<string>(stocks[0]);

  const [initialData, setInitialData] = useState([] as StockData[]);
  const [error, setError] = useState<string | null>(null);

  const timeframe = "1min"; // 1min, 5min, 15min, 30min, 1hour, 4hour - the timeframe of the stock data
  const api_key = "2vpTWrRYP8XvriGjkXX9fG2zZtP009mQ";

  useEffect(() => {
    if (activeStockTicker && activeStockTicker.length > 0) {
      const newTabStocks = [...tabStocks];
      if (!newTabStocks.includes(activeStockTicker)) {
        newTabStocks.push(activeStockTicker);
        setTabStocks(newTabStocks);
      }
    }
  }, [activeStockTicker, tabStocks]);

  
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);




  useEffect(() => {
    const fetchData = async () => {
      if (!date?.from || !date?.to) {
        setError("Invalid date range");
        return;
      }

      try {
        const startOfDay = new Date(date.from.toISOString());
        startOfDay.setHours(start_hh, start_mm, 0, 0);

        const endOfDay = new Date(date.to.toISOString());
        endOfDay.setHours(end_hh, end_mm, 0, 0);

        const url = `https://financialmodelingprep.com/api/v3/historical-chart/${timeframe}/${activeStockTicker}?from=${startOfDay.toISOString()}&to=${endOfDay.toISOString()}&apikey=${api_key}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          const hist_json = response.data;

          // Reverse the array to have the latest data first
          const reversedData = hist_json.reverse();

          // Convert date strings to Date objects
          const processedData = reversedData.map((d) => ({
            ...d,
            date: new Date(d.date),
          }));

          setInitialData(processedData);
        } else {
          setError(
            `Failed to fetch data for ${activeStockTicker}. Status code: ${response.status}`,
          );
        }
      } catch (error) {
        setError(
          `Failed to fetch data for ${activeStockTicker}. Error: ${
            error.message || error
          }`,
        );
        console.error(error); // Log the full error for debugging
      }
    };

    fetchData();
  }, [
    date,
    activeStockTicker,
    timeframe,
    api_key,
    start_hh,
    start_mm,
    end_hh,
    end_mm,
    setInitialData,
    setError,
  ]);

  // const parsedOrders = orders?.map((order) => ({
  //   ...order,
  //   created_at: new Date(order.created_at as Date), // Converts string to Date object
  // }));

  const ScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d) => new Date(d.date),
    );
 

  const rsiCalculator = rsi()
    .options({ windowSize: 14 })
    .merge((d: any, c: any) => {
      d.rsi = c;
    })
    .accessor((d: any) => d.rsi);

  // const calculator = bollingerBand()
  //   .merge((d: any, c: any) => {
  //     d.bb = c;
  //   })
  //   .accessor((d: any) => d.bb);

  // const calculatedData = rsiCalculator(ema26(ema12(calculator(initialData))));
  const { data, xScale, xAccessor, displayXAccessor } =
    ScaleProvider(initialData);
  const pricesDisplayFormat = format(".2f");
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max];

 
  const elderRayHeight = 0;
  const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
 
 
  const barChartExtents = (data: StockData) => {
    return data.volume;
  };

  const candleChartExtents = (data: StockData) => {
    return [data.high, data.low];
  };

 
  const volumeColor = (data: StockData) => {
    return data.close > data.open
      ? "rgba(38, 166, 154, 0.3)"
      : "rgba(239, 83, 80, 0.3)";
  };

  const volumeSeries = (data: StockData) => {
    return data.volume;
  };

  // const svgAnnotation = {
  //   fill: "#2196f3",
  //   path: () =>
  //     "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  //   pathWidth: 12,
  //   pathHeight: 22,
  //   tooltip: "Svg Annotation",
  //   y: ({ yScale, datum }: any) => yScale(datum.high),
  // };

  // const router = useRouter();

  const handleStockTabActivate = (stock: string) => {
    setActiveStock(stock);
    //   onSetActiveStock(stock);
    // router.replace(`/dashboard/stock/${stock}`);
  };

  const handleStockTabDelete = (e: React.MouseEvent, stock: string) => {
    e.stopPropagation(); 
    const newTabStocks = tabStocks.filter((s) => s !== stock);
    setTabStocks(newTabStocks);
  };

    // ... (keep all the existing chart logic)

  // Ensure we have valid dimensions before rendering
  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div ref={containerRef} style={{ width: '100%', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {stock_length > 2 && (
        <div className=" flex-row rounded-lg bg-gray-100 dark:bg-zinc-900  scroll-container">
          {tabStocks &&
            tabStocks.length > 0 &&
            tabStocks.map((stock) => {
              if (stock && stock.length > 0) {
                return (
                  <StockTabItem
                    key={stock}
                    price={stockPrices.get(stock).price}
                    stock={stock}
                    count={
                      orders?.filter((order) => order.symbol === stock).length
                    }
                    isActive={stock === activeStockTicker}
                    pageTabActivate={handleStockTabActivate}
                    pageTabDelete={handleStockTabDelete}
                  />
                );
              }
            })}
        </div>
      )}

      <div>
        <ChartCanvas
         height={dimensions.height}
         ratio={3}
         width={dimensions.width}
         margin={{ left: 0, right: 48, top: 10, bottom: 26 }}
          data={data}
          displayXAccessor={displayXAccessor}
          seriesName="Data"
          xScale={xScale}
          xAccessor={xAccessor}
          xExtents={xExtents}
          zoomAnchor={lastVisibleItemBasedZoomAnchor}
        >
           <Chart id={2} height={dimensions.height * 0.2} origin={(w, h) => [0, h - dimensions.height * 0.2]} yExtents={barChartExtents}>
            <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
          </Chart>

          {/* <Chart
            id={2}
            height={barChartHeight}
            origin={barChartOrigin}
            yExtents={barChartExtents}
          >
            <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
          </Chart> */}
          <Chart id={3} height={dimensions.height * 0.8} yExtents={candleChartExtents}>
            <XAxis showTickLabel={true} />
            <YAxis tickFormat={pricesDisplayFormat} />
            <CandlestickSeries />

            {orders?.map((order) => {
              const {
                side,
                status,
                filled_qty,
                qty,
                comment,
                limit_price,
                pnl,
                filled_avg_price,
                filled_at,
                created_at,
                canceled_at,
                amount,
                execution_time,
              } = order;

              let icon,
                backgroundColor,
                textColor = "";

              switch (status) {
                case "filled":
                  icon = "✔";
                  backgroundColor =
                    side === "buy" ? "lightgreen" : "lightcoral"; // Replace RGBA with color names
                  textColor = side === "buy" ? "green" : "red"; // Replace hex with color names
                  break;
                case "new":
                  icon = "↻"; // Example of a string for an icon
                  backgroundColor = "lightyellow"; // Replace RGBA with color names
                  textColor = "olive"; // Replace hex with color names

                  break;
                case "canceled":
                  icon = "✖"; // Simple X for canceled
                  backgroundColor = "grey"; // Replace RGBA with color names
                  textColor = "grey"; // Replace hex with color names
                  break;
                default:
                  icon = "🤷";
                  backgroundColor = "grey"; // Replace RGBA with color names
                  textColor = "grey"; // Replace hex with color names
              }

              const text = `${side.toUpperCase()} ${
                  status === "filled" ?  filled_qty : `(${qty})`
              } ${icon}`;
            
            const tooltip = `
            ╔════════════════════════════════════════════════╗
            ║ 📉 Trade: ${text}
            ║ 👉🏻 Reason: ${comment ? comment : "Unknown" } 
            ${limit_price ? `║ 🏷️ Limit Price: $${limit_price}` : ""}
            ${filled_avg_price ? `║ 📊 Filled Avg Price: $${filled_avg_price}` : ""}
            ${amount ? `║ 💵 Amount: $${amount}` : ""}
            ${pnl ? `║ 💲 PnL: $${pnl}` : ""}
            ${created_at ? `║ 📅 Created At: ${new Date(created_at).toLocaleString()}` : ""}
            ${filled_at ? `║ ✔️ Filled At: ${new Date(filled_at).toLocaleString()}` : ""}
            ${canceled_at ? `║ ❌ Canceled At: ${new Date(canceled_at).toLocaleString()}` : ""}
            ${execution_time ? `║ ⏱️ Execution Time: ${execution_time}` : ""}
            ${qty ? `║ 🫧 Qty: ${qty}` : ""}
            ${filled_qty ? `║ 📦 Filled Qty: ${filled_qty}` : ""}
            ${status ? `║ 📊 Status: ${status}` : ""}
            ${side ? `║ 🛍️ Side: ${side}` : ""}
            ╚════════════════════════════════════════════════╝
            `.trim();

              return (
                <Annotate
                  key={order.id}
                  with={LabelAnnotation}
                  usingProps={{
                    text: text,
                    tooltip: tooltip,
                    y: ({ yScale, datum }) => yScale(datum.high),
                    className: order.side,
                    fill: textColor,
                    opacity: 1,
                    fontSize: 18,
                    textFill: textColor,
                    textOpacity: 1,
                    textAnchor: "middle",
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    background: backgroundColor,
                    backgroundOpacity: 1,
                    padding: 5,
                    textStroke: "black",
                    backgroundColor: backgroundColor,
                    textStrokeWidth: 1,
                    textOutlineWidth: 1,
                    textOutlineColor: "black",
                    textOutlineOpacity: 1,
                    textOutlineRadius: 5,
                  }}
                  when={(d) =>
                    d.date.getMinutes() ===
                      new Date(order.created_at).getMinutes() &&
                    d.date.getHours() ===
                      new Date(order.created_at).getHours() &&
                    d.date.getDate() === new Date(order.created_at).getDate() &&
                    d.date.getMonth() === new Date(order.created_at).getMonth()
                  }
                />
              );
            })}
 
          
            <MouseCoordinateY displayFormat={pricesDisplayFormat} />

            <ZoomButtons />
            <OHLCTooltip origin={[8, 16]} />
          </Chart>

          <Chart
            id={4}
            yExtents={[0, rsiCalculator.accessor()]}
            origin={elderRayOrigin}
             
          >
            <XAxis />
            <YAxis ticks={4} tickFormat={pricesDisplayFormat} />
          </Chart>
          <CrossHairCursor />
        </ChartCanvas>
      </div>
    </div>
  );
}
