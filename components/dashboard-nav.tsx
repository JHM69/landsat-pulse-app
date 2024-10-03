"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isShow?: boolean;
}

export function DashboardNav({ items, setOpen, isShow }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                path === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                item.disabled && "pointer-events-none opacity-60"
              )}
            >
              <Icon className={cn("h-8 w-8 transition-all duration-200", isShow ? "mr-2" : "mr-0")} />
              {isShow && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-semibold"
                >
                  {item.title}
                </motion.span>
              )}
              {path === item.href && (
                <motion.div
                  className="absolute inset-0 z-[-1] rounded-md bg-accent"
                  layoutId="active-nav-item"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )
        );
      })}
    </nav>
  );
}