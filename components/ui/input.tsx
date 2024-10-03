import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <label className="sr-only" htmlFor="input-field">Input</label>
        <input
          ref={ref}
          type={type}
          id="input-field"
          className={cn(
            "block w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
            className
          )}
          {...props}
        />
        {/* <div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Stocks (${stocks && stocks.length}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Stocks</SelectLabel>
                {stocks && stocks.length > 0 && stocks?.map((stock) => (
                  <SelectItem key={stock.id} value={stock.symbol}>
                    {stock.symbol}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
