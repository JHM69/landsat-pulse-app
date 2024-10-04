'use client'

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import MapSelection from "@/components/layout/MapSelection";

const breadcrumbItems = [{ title: "Shape", link: "/dashboard/shape" }];

const convertGeoJson = (geoJson) => {
  console.log(geoJson);
  let n = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: geoJson.geometry.coordinates,
          type: "Polygon",
        },
      },
    ],
  };
  const jsonString = JSON.stringify(n);
  const encodedString = encodeURIComponent(jsonString);
  console.log(encodedString);
  return encodedString;
};

export default function Page() {
    const [isLoadingSatellite, setIsLoadingSatellite] = useState(false);

  const [geoJson, setGeoJson] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [newLocationDialogOpen, setNewLocationDialogOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(""); 

  const session = useSession();

  const { data, isLoading, error } = trpc.getPlaces.useQuery(
    {
      email: session?.data?.user?.email ?? "",
    },
    {
      enabled: !!session?.data?.user?.email,
    },
  );

  const handleViewSatelliteData = (location) => {
    setIsLoadingSatellite(true);
    setGeoJson(location.geojson);
    const encodedGeoJson = convertGeoJson(location.geojson);
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    setIframeUrl(
      `${process.env.NEXT_PUBLIC_PYTHON_URL}/api/landsat/shape?cloud=20&geojson=${encodedGeoJson}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    );
    setIsLoadingSatellite(false);
  };

  const handleAddNewLocation = () => {
    setIsLoadingSatellite(true);
    const encodedGeoJson = convertGeoJson(geoJson);
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    setIframeUrl(
      `${process.env.NEXT_PUBLIC_PYTHON_URL}/api/landsat/shape?cloud=20&geojson=${encodedGeoJson}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
    );
    setIsLoadingSatellite(false);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex">
          <div className="w-1/4 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dialog
                  open={startDialogOpen}
                  onOpenChange={setStartDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Start Date: {format(startDate, "PP")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Start Date</DialogTitle>
                    </DialogHeader>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartDialogOpen(false);
                      }}
                      initialFocus
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      End Date: {format(endDate, "PP")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select End Date</DialogTitle>
                    </DialogHeader>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndDialogOpen(false);
                      }}
                      initialFocus
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Places</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && <p>Loading places...</p>}
                {error && <p>Error loading places: {error.message}</p>}
                {data?.locations && (
                  <ul className="space-y-2">
                    {data.locations.map((location) => (
                      <li key={location.id}>
                        <Card>
                          <CardContent className="p-4">
                            <p className="font-semibold text-xl">{location.name ? location.name : "Unnamed Location"}</p>
                            <Button
                              onClick={() => handleViewSatelliteData(location)}
                              className="mt-2"
                            >
                              View Satellite Data
                            </Button>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              onClick={() => setNewLocationDialogOpen(true)}
            >
              Add New Location
            </Button>

            <Dialog
              open={newLocationDialogOpen}
              onOpenChange={setNewLocationDialogOpen}
            >
              <DialogTrigger asChild>
                <div />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <MapSelection
                  onLatLongChange={(lat, long, geojson) => {
                    setGeoJson(geojson);
                  }}
                  initialGeoJSON={geoJson}
                />
                <Button
                  onClick={() => {
                    handleAddNewLocation();
                    setNewLocationDialogOpen(false);
                  }}
                >
                  See Landsat Image
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-3/4 p-2 rounded-md">
        {isLoadingSatellite ? (
          <div className="flex items-center justify-center h-[700px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading satellite data...</span>
          </div>
        ) : (
          iframeUrl && (
            <iframe
              src={iframeUrl}
              className="w-full h-full"
              title="Satellite Data"
              style={{ height: "700px" }}
              onLoad={() => setIsLoadingSatellite(false)} // Add this line to stop loading when iframe is loaded
            />
          )
        )}
      </div>
        </div>
      </div>
    </ScrollArea>
  );
}
