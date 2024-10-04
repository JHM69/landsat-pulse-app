import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BreadCrumb from "@/components/breadcrumb";
import Satellite2D from "./2d";
import Satellite3D from "./3d";  // Assuming you have this component

const breadcrumbItems = [{ title: "Landsat Tracker", link: "/dashboard/tracker" }];

export default function TabbedSatelliteView() {
  return (
    <div className="container mx-auto p-4">
      <BreadCrumb items={breadcrumbItems} />
      
      <Tabs defaultValue="3d" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d">3D View</TabsTrigger>
          <TabsTrigger value="2d">2D View</TabsTrigger>
        </TabsList>
        <TabsContent value="3d">
          <Satellite3D />
        </TabsContent>
        <TabsContent value="2d">
          <Satellite2D />
        </TabsContent>
      </Tabs>
    </div>
  );
}