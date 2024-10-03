"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";  
import { useState } from "react";

export default function Sidebar() {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
        className={cn(
          "relative h-screen border-r pt-16 transition-all duration-300",
          isShow ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full space-y-4 py-4">
           
          <div className="space-y-1">
            <DashboardNav items={navItems} isShow={isShow} />
          </div>
        </div>
      </nav>
    </div>
  );
}