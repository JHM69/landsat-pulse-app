/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-undef */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  Clock,
  DollarSign,
  Info,
  MoreHorizontal,
} from "lucide-react";
import { orders } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "path"; 

const formatDate = (date) => (date ? format(new Date(date), "PPp") : "N/A");
const formatDecimal = (value, decimals = 2) =>
  value ? Number(value).toFixed(decimals) : "N/A";
const OrderDetails = ({ order }) => {
  if (!order) return null;
  const profitClassName =
    order.realised_profit >= 0 ? "text-green-600" : "text-red-600";
  const sideIcon =
    order.side === "buy" ? (
      <ArrowUpCircle className="text-green-600" />
    ) : (
      <ArrowDownCircle className="text-red-500" />
    );

    


  return (
    <div className="max-w-7xl mx-auto p-4 h-[calc(70vh-2rem)] overflow-y-auto">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Order Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p>
            <strong>Created:</strong> {formatDate(order.created_at)}
          </p>
          <p>
            <strong>Updated:</strong> {formatDate(order.updated_at)}
          </p>
          <p>
            <strong>Submitted:</strong> {formatDate(order.submitted_at)}
          </p>
          <p>
            <strong>Filled:</strong> {formatDate(order.filled_at)}
          </p>
          <p>
            <strong>Expired:</strong> {formatDate(order.expired_at)}
          </p>
          <p>
            <strong>Canceled:</strong> {formatDate(order.canceled_at)}
          </p>
          <p>
            <strong>Failed:</strong> {formatDate(order.failed_at)}
          </p>
          <p>
            <strong>Replaced:</strong> {formatDate(order.replaced_at)}
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {sideIcon}
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p>
            <strong>Symbol:</strong> {order.symbol}
          </p>
          <p>
            <strong>Side:</strong> {order.side}
          </p>
          <p>
            <strong>Quantity:</strong> {formatDecimal(order.qty, 9)}
          </p>
          <p>
            <strong>Asset ID:</strong> {order.asset_id}
          </p>
          <p>
            <strong>Asset Class:</strong> {order.asset_class}
          </p>
          <p>
            <strong>Order Class:</strong> {order.order_class}
          </p>
          <p>
            <strong>Order Type:</strong> {order.order_type}
          </p>
          <p>
            <strong>Type:</strong> {order.type}
          </p>
          <p>
            <strong>Time in Force:</strong> {order.time_in_force}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Extended Hours:</strong>{" "}
            {order.extended_hours ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} />
            Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <p>
            <strong>Stock Price:</strong> ${formatDecimal(order.stock_price, 4)}
          </p>
          <p>
            <strong>Amount:</strong> ${formatDecimal(order.amount, 4)}
          </p>
          <p>
            <strong>Notional:</strong> ${formatDecimal(order.notional, 9)}
          </p>
          <p>
            <strong>Filled Quantity:</strong>{" "}
            {formatDecimal(order.filled_qty, 9)}
          </p>
          <p>
            <strong>Filled Avg Price:</strong> $
            {formatDecimal(order.filled_avg_price, 9)}
          </p>
          <p>
            <strong>Limit Price:</strong> ${formatDecimal(order.limit_price, 9)}
          </p>
          <p>
            <strong>Stop Price:</strong> ${formatDecimal(order.stop_price, 9)}
          </p>
          <p>
            <strong>Trail Percent:</strong>{" "}
            {formatDecimal(order.trail_percent, 5)}%
          </p>
          <p>
            <strong>Trail Price:</strong> ${formatDecimal(order.trail_price, 9)}
          </p>
          <p>
            <strong>HWM:</strong> ${formatDecimal(order.hwm)}
          </p>
        </CardContent>
      </Card>

      {order.comment && (
        <Card>
          <CardHeader>
            <CardTitle>Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.comment}</p>
          </CardContent>
        </Card>
      )}

      {order.side === "buy" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={20} />
              Profit and Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${profitClassName}`}>
              ${formatDecimal(-order.realised_profit, 2)}
            </p>
          </CardContent>
          <CardContent>
            Condition:{" "}
            <p className={`text-2xl font-bold ${profitClassName}`}>
              {order.condition}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ProfitCell = ({ v }) => {
  // Extract the profit value and handle NaN case
  const profit = isNaN(v) ? " " : parseFloat(v).toFixed(2);

  // Determine the color: green for positive values
  const color = profit > 0 ? "green" : "black";

  return (
    <div className="text-right" style={{ color }}>
      ${profit}
    </div>
  );
};


const columns: ColumnDef<orders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => {
      const handleClick = () => { 
        const symbol = row.getValue("symbol"); 
        onSymbolClicked(symbol) 
      };

      return (
        <div className="capitalize text-u" onClick={handleClick}>
          {row.getValue("symbol")}
        </div>
      );
    },
  },
   {
    accessorKey: "limit_price",
    header: "Limit Price",
    cell: ({ row }) => {
      const type = row.original.type; // Access the type field
      const value = type === "market" ? row.getValue("filled_avg_price") : row.getValue("limit_price");
      return <div className="text-right">${value}</div>;
    },
  },
  {
    accessorKey: "side",
    header: "Side",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("side") === "buy" ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.getValue("side")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "qty",
    header: "Qty",
    cell: ({ row }) => <div className="text-right">{row.getValue("qty")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    // show 2 decimal places
    cell: ({ row }) => (
      <div className="text-right">${Number(row.getValue("amount")?.toFixed(2))}</div>
    ),
  },
   {
    accessorKey: "realised_profit",
    header: "PnL",
    cell: ({ row }) => {
      const value = row.getValue("realised_profit");
      const profit = value !== null && value !== "" ? Number(value) : 0;
      return <ProfitCell v={profit} />;
    },
  },
 
    {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/New_York' };
      const timeString = date.toLocaleTimeString('en-US', options);
      return <div>{timeString}</div>;
    },
  },
  {
    accessorKey: "filled_qty",
    header: "Filled Qty",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("filled_qty")}</div>
    ),
  },
  {
    accessorKey: "comment",
    header: "",
    cell: ({ row }) => (
      <div
        key={row.getValue("realised_profit") + row.getValue("condition")}
        className="flex items-center space-x-2 max-w-xs"
      >
        {row.getValue("comment") && (
          <div className="relative group">
            <button
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
              title="View Details"
            >
              <Info className="h-4 w-4" />
            </button>
            <div className="absolute bottom-full left-1/2 transform +translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {row.getValue("comment")}
              {row.getValue("realised_profit") !== undefined && (
                <div className="mt-2">
                  <strong>Realised Profit:</strong>{" "}
                  <span className="text-bold">
                    ${row.getValue("realised_profit")}
                  </span>
                </div>
              )}
              {row.getValue("condition") && (
                <div className="mt-2">
                  <strong>Condition:</strong>{" "}
                  <span className="text-bold">{row.getValue("condition")}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "filled_avg_price",
    header: "Filled Avg Price",
    cell: ({ row }) => (
      <div className="text-right">${row.getValue("filled_avg_price")}</div>
    ),
  },
  {
    accessorKey: "execution_time",
    header: "Time of Trade",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("execution_time")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  View details
                </DropdownMenuItem>
              </DialogTrigger>
               
            </Dialog> 
            
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export { columns };
