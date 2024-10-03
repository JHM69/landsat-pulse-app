"use client"; 
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator"; 
import { use, useEffect, useState } from "react"; 
import { trpc } from "@/utils/trpc";
import { CalendarDateRangePicker } from "@/components/date-range-picker"; 
import { addDays } from "date-fns";
import { StockAdd } from "@/components/modal/stock-add-modal";

export const Places = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 200;

  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
 
  const [symbol, setSymbol] = useState("");

  // order with type
  const [stocks, setStocks] = useState<string>([]);

  const handleDateChange = (newDateRange : any) => {
    console.log("Date Changed Client");
    console.log(newDateRange);
    setDate(newDateRange);
  };


  const { data, status, refetch } = trpc.getPlaces.useQuery(
    {
      from: date?.from?.toISOString().split('T')[0] ?? "",
      to:  date?.to?.toISOString().split('T')[0] ?? "",
      symbol: symbol,
      page,
      limit,
    },
  );
 
  // run refetch after 10 seconds to get the latest data
  // setTimeout(() => {
  //   refetch();
  // }, 5000);


  const [showOrderCreatedDialog, setShowOrderCreatedDialog] = useState(false);

  return (
    <>
      List of all Places added by this user 
      {
        data?.places.map((place) => {
          return (
            <div key={place.id}>
              {place.name}
            </div>
          );
        })
      }
    </>
  );
};
