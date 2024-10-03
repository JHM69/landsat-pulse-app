import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Landsat Map", link: "/dashboard/landsatmap" },
];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* add an iframe  */}
      <iframe
        src={process.env.NEXT_PUBLIC_PYTHON_URL+"/api/landsat?cloud=20"}
        className="w-full h-full"
        title="Settings"
        style={{ height: "700px" }}
      ></iframe>
    </ScrollArea>
  );
}
