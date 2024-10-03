/* eslint-disable import/no-unresolved */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface StockPsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  setSearchKey: (key: string) => void;
  setPercent: (percent: number) => void;
  setTimeValue: (time: number) => void;
  stocks?: string[];
  activeStock?: string;
  
}

export function StockPsDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  setSearchKey,
  stocks,
  activeStock,
  setPercent,
  setTimeValue,
}: StockPsDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const times = [ '1 min', "2 mins", "5 mins", "7 mins", "10 mins", "20 mins"];

  const percentages = [
    '5%',
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
    "110%",
    "120%",
    "130%",
    "140%",
    "150%",
    "160%",
    "170%",
    "180%",
    "190%",
  ];

  return (
    <>
      <div className="flex flex-row ">
        {times && times.length > 0 && (
          <Select
            onValueChange={(value) => {
              setTimeValue(
                value === "1 min"
                  ? 60
                  : value === "2 mins"
                  ? 2 * 60
                  : value === "5 mins"
                  ? 5 * 60
                  : value === "7 mins"
                  ? 7 * 60
                  : value === "10 mins"
                  ? 10 * 60
                  : value === "20 mins"
                  ? 20 * 60
                  : 0, 
              )
            }}
          >
            <SelectTrigger className="w-4/12">
              <SelectValue
                placeholder={`Time`}
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Times</SelectLabel>
                {times &&
                  times.length > 0 &&
                  times?.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {percentages && percentages.length > 0 && (
          <Select 
            onValueChange={(value) => {
              setPercent(Number(value.split("%")[0]));
            }}
          >
            <SelectTrigger className="w-4/12 ml-2">
              <SelectValue
                placeholder={`Percentage`}
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Times</SelectLabel>
                {percentages &&
                  percentages.length > 0 &&
                  percentages?.map((percentage) => (
                    <SelectItem key={percentage} value={percentage}>
                      {percentage}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn(searchKey)?.setFilterValue(event.target.value);
            setSearchKey(event.target.value);
          }}
          className="w-full"
        />
      </div>

      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
          {/* Sum of row.amount */}
          <b>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span className="text-muted-foreground">
                {" "}
                Total:{" "}
                {table
                  .getFilteredSelectedRowModel()
                  .rows.reduce(
                    (acc, row) => acc + Number((row.original as any).amount),
                    0,
                  )
                  .toLocaleString("en-US")}
              </span>
            )}
          </b>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
