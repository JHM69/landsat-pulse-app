/* eslint-disable react-hooks/rules-of-hooks */
"use client";
 
import BreadCrumb from "@/components/breadcrumb";  
 
const breadcrumbItems = [{ title: "Order", link: "/dashboard/order" }];
export default function page() {

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
         Validate Landsat Data
      </div>
    </>
  );
}
