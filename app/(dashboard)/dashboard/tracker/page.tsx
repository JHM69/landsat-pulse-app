import BreadCrumb from "@/components/breadcrumb";
 
const breadcrumbItems = [{ title: "Landsat Tracker", link: "/dashboard/tracker" }];
export default function page() {
   
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
         Landsat Track with paths and predictions
      </div>
    </>
  );
}
