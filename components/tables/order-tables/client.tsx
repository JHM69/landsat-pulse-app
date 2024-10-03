"use client"; 
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator"; 
import { use, useEffect, useState } from "react"; 
import { trpc } from "@/utils/trpc";
import { CalendarDateRangePicker } from "@/components/date-range-picker"; 
import { addDays } from "date-fns";
import { StockAdd } from "@/components/modal/stock-add-modal";
import { useSession } from "next-auth/react";
import { DateRange } from "react-day-picker";
import LocationCards from "@/components/map/LocationCard";

export const Places = () => {
  
  const session = useSession();

// Ensure that email is available before making the query
const { data, isLoading, error, refetch } = trpc.getPlaces.useQuery(
  {
    email: session?.data?.user?.email ?? '', // Provide a fallback if email is undefined
  },
  {
    enabled: !!session?.data?.user?.email, // Only run the query if email exists
  }
);
 
 
  return (
    <>
      List of all Places added by this user 
      
      <LocationCards locations={data?.locations} />
         
      
    </>
  );
};
