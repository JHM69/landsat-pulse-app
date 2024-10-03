/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { Places } from "@/components/tables/order-tables/client";
import { Button } from "@/components/ui/button";
import { ListChecksIcon, MapPinnedIcon } from "lucide-react";
import React from "react";

const breadcrumbItems = [{ title: "Place", link: "/dashboard/place" }];
export default function page() {
  // createPlace will take to /dashboard/place/create-new
  const createPlace = (value: boolean) => {
    if (value) {
      window.location.href = "/dashboard/place/create-new";
    }
  };

  return (
    <>
      <div className="flex space-y-4 flex-col p-4 md:p-8 pt-6">
       <div className="flex flex-row justify-between items-end">
       <BreadCrumb items={breadcrumbItems} />
        <Button
          className="text-s md:text-sm text-white bg-gray-800 hover:bg-gray-900 font-bold py-2 px-4 rounded shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
          onClick={() => createPlace(true)}
        >

          <MapPinnedIcon className="mr-2 h-4 w-4" /> Add Place
        </Button>
       </div>
        <Places />
      </div>
    </>
  );
}
