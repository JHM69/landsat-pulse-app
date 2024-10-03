"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { Icons } from "./icons"
import { cn } from "@/lib/utils"
const Tabs = TabsPrimitive.Root
const TabsList = TabsPrimitive.List
const TabsTrigger = TabsPrimitive.Trigger

type StockTabItemProps = {
    stock: string
    isActive: boolean
    pageTabActivate: (stock: string) => void
    pageTabDelete: (e: React.MouseEvent, stock: string) => void
    price?: number
    lastUpdated? : number
    count?: number
}

function StockTabItem({ stock, isActive, pageTabActivate, pageTabDelete, count, price, lastUpdated }: StockTabItemProps) {
 
  return (
    <Tabs>
      <TabsList className="inline-flex h-10 items-center justify-center p-1">
        <TabsTrigger 
                  className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      isActive && " bg-gray-200 dark:bg-black outline outline-[2px] tracking-tight text-foreground shadow-lg"
                  )}
                  onClick={() => pageTabActivate(stock)} value={""}        >
          {stock } -  {price && <span className="text-xs text-gray-500 dark:text-gray-400">{price} </span>}
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevents the tab activation when clicking the close icon
              pageTabDelete(e, stock);
            }}
            className="ml-2 cursor-pointer"
          >
            <Icons.close className="w-4 h-4 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 hover:rounded-full"/>
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default StockTabItem;
