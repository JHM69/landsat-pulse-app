import BreadCrumb from "@/components/breadcrumb";
import { CreatePlaceWithNotification } from "@/components/forms/user-place-stepper/create-place";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [{ title: "New Place", link: "/dashboard/place/new-place" }];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <CreatePlaceWithNotification categories={[]} initialData={null} />
      </div>
    </ScrollArea>
  );
}
