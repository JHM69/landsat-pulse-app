"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "8 May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "9",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "10",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "11",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "12",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "13",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "14",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "15",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "16",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "17",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "19 May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#656565" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
