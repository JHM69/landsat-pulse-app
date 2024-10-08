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

import { addDays, set } from "date-fns";
import { useEffect, useState, useCallback } from "react";

import { DateRange } from "react-day-picker";  
import { Slider } from "@/components/ui/slider";
import { useSearchParams, usePathname, useRouter } from "next/navigation"; 

export default function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const [selectedOption, setSelectedOption] = useState(
    searchParams.get("landsat") || "landsat-9"
  );

  const [date, setDate] = useState<DateRange>(() => {
    const fromDate = parseDate(searchParams.get("from"));
    const toDate = parseDate(searchParams.get("to"));
    return {
      from: fromDate ||  addDays(new Date(), -30),
      to: toDate || addDays(new Date(), 0),
    };
  });

  const [lat, setLat] = useState(() => {
    try {
      return searchParams.get("lat") || "29.7604";
    } catch (error) {
      console.error("Error parsing latitude parameter:", error);
      return "29.7604";
    }
  });
  
  const [lon, setLon] = useState(() => {
    try {
      return searchParams.get("lon") || "-95.3698";
    } catch (error) {
      console.error("Error parsing longitude parameter:", error);
      return "-95.3698";
    }
  });
  const [cloud, setCloud] = useState(() => {
    try {
      return parseInt(searchParams.get("cloud") || "20");
    } catch (error) {
      console.error("Error parsing cloud parameter:", error);
      return 20;
    }
  });

  const [iframeLoading, setIframeLoading] = useState(true);
  
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("start_date", date?.from?.toISOString() || "");
    params.set("end_date", date?.to?.toISOString() || "");
    params.set("cloud", cloud.toString());
    params.set("lat", lat);
    params.set("lon", lon);
    params.set("landsat", selectedOption);

    router.push(`${pathname}?${params.toString()}`);
  }, [date, lat, lon, selectedOption, router, pathname, cloud, searchParams]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // New useEffect to fetch user's geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude.toString());
        setLon(longitude.toString());
        setIsFetchingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
        setIsFetchingLocation(false);
      }
    );
  }, []);

  const handleSelect = useCallback((value: string) => {
    setSelectedOption(value);
  }, []);

  const handleDateChange = useCallback((newDateRange: DateRange) => {
    setDate(newDateRange);
  }, []);

  const handleIframeRender = () => {
    return (
      <iframe
        src={`${process.env.NEXT_PUBLIC_PYTHON_URL}/api/landsat?cloud=${cloud}&lat=${lat}&lon=${lon}&landsat=${selectedOption}&start_date=${date?.from?.toISOString()}&end_date=${date?.to?.toISOString()}`}
        className="w-full h-full"
        title="Landsat Map"
        style={{ height: "640px" }}
        onLoad={() => setIframeLoading(false)}
      ></iframe>
    );
  };

  useEffect(() => {
    handleIframeRender();
    setIframeLoading(true);
  }, [cloud, lat, lon, selectedOption, date]);

  return (
    <div className="relative">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-1"> 
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker defaultDate={date} onDateChange={handleDateChange} />

            <div className="w-[110px] flex items-center space-x-2">
              <Slider
                value={[cloud]}
                onValueChange={(val) => setCloud(val[0])}
                min={1}
                max={100}
                className="w-[100px]"
              />
              <span>Cloud: {cloud}%</span>
            </div>

            <div className="w-[110px] flex items-center space-x-2">
              <Select value={selectedOption} onValueChange={handleSelect}>
                <SelectTrigger>
                  <span>{selectedOption}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landsat-9">Landsat 9</SelectItem>
                  <SelectItem value="landsat-8">Landsat 8</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div> 
          </div>
        </div>

        {/* Optional: Show location fetching status or errors */}
        <div className="mb-4">
          {isFetchingLocation && (
            <p className="text-gray-500">Fetching your location...</p>
          )}
          {locationError && (
            <p className="text-red-500">Error: {locationError}</p>
          )}
        </div>

        <div className="mt-8">
            {iframeLoading && (
              <div>
              <p>Loading map...</p>
              <p>Cloud Coverage: {cloud}%</p>
              <p>Date Range: {date?.from?.toLocaleDateString()} - {date?.to?.toLocaleDateString()}</p>
              <p>Latitude: {lat}</p>
              <p>Longitude: {lon}</p>
              <p>Landsat: {selectedOption}</p>
              </div>
            )}
            {handleIframeRender()}
          
          
        </div>
      </div>
    </div>
  );
}
