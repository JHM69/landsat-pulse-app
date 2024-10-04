/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { addDays } from "date-fns";
import { useEffect, useState, useCallback } from "react";

import { DateRange } from "react-day-picker";
import { ListChecksIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeRangeSelector } from "@/components/ui/time-select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import WorldMap from "@/components/WorldMap";

export default function page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const [activeStock, setActiveStock] = useState<string>(
    searchParams.get("symbol") || "All Stocks",
  );
  const [selectedOption, setSelectedOption] = useState(
    searchParams.get("env") || "landsat-9",
  );
  const [tabStocks, setTabStocks] = useState<string[]>(["All Stocks"]);
  const [start_hh, setStartHH] = useState(
    parseInt(searchParams.get("start_hh") || "9"),
  );
  const [start_mm, setStartMM] = useState(
    parseInt(searchParams.get("start_mm") || "30"),
  );
  const [end_hh, setEndHH] = useState(
    parseInt(searchParams.get("end_hh") || "16"),
  );
  const [end_mm, setEndMM] = useState(
    parseInt(searchParams.get("end_mm") || "0"),
  );
  const [date, setDate] = useState<DateRange>(() => {
    const fromDate = parseDate(searchParams.get("from"));
    const toDate = parseDate(searchParams.get("to"));
    return {
      from: fromDate || new Date(),
      to: toDate || addDays(new Date(), 0),
    };
  });

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", date?.from?.toISOString() || "");
    params.set("to", date?.to?.toISOString() || "");
    params.set("start_hh", start_hh.toString());
    params.set("start_mm", start_mm.toString());
    params.set("end_hh", end_hh.toString());
    params.set("end_mm", end_mm.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [
    pathname,
    router,
    searchParams,
    date,
    start_hh,
    start_mm,
    end_hh,
    end_mm,
  ]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const { data, status, refetch } = trpc.getDashboard.useQuery({
    from: date?.from?.toISOString() ?? "",
    to: date?.to?.toISOString() ?? "",
    symbol: activeStock,
    start_hh,
    start_mm,
    end_hh,
    end_mm,
    env: selectedOption,
  });

  const handleSelect = useCallback((value: string) => {
    setSelectedOption(value);
  }, []);

  const handleStartTimeChange = useCallback(
    (newTime: { hour: number; minute: number }) => {
      setStartHH(newTime.hour);
      setStartMM(newTime.minute);
    },
    [],
  );

  const handleEndTimeChange = useCallback(
    (newTime: { hour: number; minute: number }) => {
      setEndHH(newTime.hour);
      setEndMM(newTime.minute);
    },
    [],
  );

  const handleDateChange = useCallback((newDateRange: DateRange) => {
    setDate(newDateRange);
  }, []);

  useEffect(() => {
    if (status === "success") {
    }
  }, [status, data, activeStock]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 60000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="relative"> 
      <WorldMap />
      
      <ScrollArea className="relative z-10 h-full"> 
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-5 mb-4 md:mb-0">
                <div className="pl-1"> 
                  <p className="text-3xl font-semibold text-blue-600"></p>
                </div> 
              </div>
            </div>
  
            <div className="hidden md:flex items-center space-x-2">
              <CalendarDateRangePicker defaultDate={date} onDateChange={handleDateChange} />
              <TimeRangeSelector 
                startTime={{ hour: start_hh, minute: start_mm }}
                endTime={{ hour: end_hh, minute: end_mm }}
                onStartTimeChange={handleStartTimeChange}
                onEndTimeChange={handleEndTimeChange}
              />
              <div className="w-[110px] flex items-center space-x-2">
                <Select value={selectedOption} onValueChange={handleSelect}>
                  <SelectTrigger>
                    <span>{selectedOption}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landsat-9">Landsat 9</SelectItem>
                    <SelectItem value="landsat-8">Landsat 8</SelectItem>
                    <SelectItem value="sentinel">Sentinel 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
