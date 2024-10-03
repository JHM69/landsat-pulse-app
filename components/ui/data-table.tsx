import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
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
import { Card, CardTitle } from "./card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronsUpDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { OrderCreate } from '../modal/order-create-modal';
import { set } from 'date-fns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  setSearchKey: (key: string) => void;
  stocks?: string[];
  activeStock?: string;
  onDeleteSelected: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  setSearchKey,
  stocks,
  activeStock,
  onDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});


  const [sumOfSelectedAmount, setSumOfSelectedAmount] = useState(0);
  const [sumOfSelectedQty, setSumOfSelectedQty] = useState(0);


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    onDeleteSelected(selectedRows);
    setRowSelection({});
  };
  
  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    const sum = selectedRows.reduce((acc, row) => acc + Number(row.amount), 0);
    const qty = selectedRows.reduce((acc, row) => acc + Number(row.qty), 0);
    setSumOfSelectedAmount(-sum);
    setSumOfSelectedQty(qty)
  }, [table.getFilteredSelectedRowModel().rows]);

  const [showOrderCreatedDialog, setShowOrderCreatedDialog] = useState(false);
  return (
    <>
    <OrderCreate isOpen={showOrderCreatedDialog} onClose={() => setShowOrderCreatedDialog(false)} onConfirm={() => {}} loading={false} />
      <div className="flex flex-row items-center justify-between">
        <CardTitle>Orders: {data.length}</CardTitle>
        {stocks && stocks.length > 0 && (
          <Select
            onValueChange={(value) => {
              if (value === "All Stocks") {
                setSearchKey("");
              } else {
                setSearchKey(value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`Stocks (${stocks && stocks.length - 1})`}
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Stocks</SelectLabel>
                {stocks &&
                  stocks.length > 0 &&
                  stocks?.map((stock) => (
                    <SelectItem key={stock} value={stock}>
                      {stock}
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
          className="w-full m-0"
        />
          <Button
          className="text-xs mx-10 md:text-sm"
          onClick={() => setShowOrderCreatedDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New
        </Button>
      </div>

      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table>
          <TableHeader>
            <TableRow>
               
              {table.getHeaderGroups().map((headerGroup) => (
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span>
                            {{
                              asc: <ChevronUp className="h-4 w-4" />,
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronsUpDown className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))
              ))}
            </TableRow>
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
                  colSpan={columns.length + 1}
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
           
        </div>
 
          <div className="flex items-center space-x-2">
            <div className="flex-1 text-sm">
               <p className={`${sumOfSelectedAmount > 0 ? "text-red" : "text-green"}`}> ${sumOfSelectedAmount.toFixed(2)}</p>
            </div>
          </div>


          <div className="flex items-center space-x-2">
            <div className="flex-1 text-sm">
               <p className={`${sumOfSelectedQty> 0 ? "text-red" : "text-green"}`}> ${sumOfSelectedQty.toFixed(2)}</p>
            </div>
          </div>
      

        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          {/* <Button
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
          </Button> */}
        </div>
      </div>
    </>
  );
}