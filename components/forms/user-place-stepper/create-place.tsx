"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MapSelection from "@/components/layout/MapSelection";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Bell, Satellite } from 'lucide-react';
import { toast, useToast } from "@/components/ui/use-toast";
interface ProfileFormType {
  initialData?: any | null;
}


const DataDisplay = ({ formData }) => {
  if (!formData) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" /> Location Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
          <p><strong>Latitude:</strong> {formData.latitude}</p>
          <p><strong>Longitude:</strong> {formData.longitude}</p>
        </CardContent>
      </Card>

      {
        // Display GeoJSON data if available
        formData.geojson && (
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" /> GeoJSON Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Type:</strong> {formData.geojson.type}</p>
          <p><strong>Geometry Type:</strong> {formData.geojson.geometry.type}</p>
          <details>
            <summary className="cursor-pointer">View Coordinates</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded-md text-xs overflow-auto">
              {JSON.stringify(formData.geojson.geometry.coordinates, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
        )
      }

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.notifications.map((notification, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="flex items-center">
                <Satellite className="mr-2" /> <strong>{notification.satellite}</strong>
              </p>
              <p><strong>Notify Before:</strong> {notification.notifyBefore} days</p>
              <p><strong>Notify Via:</strong> {notification.notifyIn}</p>
              {notification.smsNumber && <p><strong>SMS Number:</strong> {notification.smsNumber}</p>}
              {notification.email && <p><strong>Email:</strong> {notification.email}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};



export const CreatePlaceWithNotification: React.FC<ProfileFormType> = ({
  initialData = null,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    id : initialData?.id || null,
    name: initialData?.name || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    geojson: initialData?.geojson || {},
    notifications: initialData?.notifications || [
      {
        satellite: "",
        notifyBefore: "",
        notifyIn: "",
        smsNumber: "",
        email: "",
      },
    ],
  });

  const { data: session } = useSession();

  console.log("Session", session);
// addLocationWithNotification
const addExamMutation = trpc.addLocationWithNotification.useMutation();

const addUpdatePlace = () => {
  addExamMutation.mutate({
    place: formData,
    email : session?.user?.email as string,
  });
};

  const title = initialData ? "Edit Place" : "Add New Place";
  const description = initialData
    ? "Edit a Place."
    : "To create a new place to analyze and get notified, please add details of it here";
  const action = initialData ? "Save changes" : "Create";

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNotificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedNotifications = formData.notifications.map((notif, i) =>
      i === index ? { ...notif, [field]: value } : notif
    );
    setFormData({ ...formData, notifications: updatedNotifications });
  };

  const addNotification = () => {
    setFormData({
      ...formData,
      notifications: [
        ...formData.notifications,
        {
          satellite: "",
          notifyBefore: "",
          notifyIn: "",
          smsNumber: "",
          email: "",
        },
      ],
    });
  };

  const removeNotification = (index: number) => {
    setFormData({
      ...formData,
      notifications: formData.notifications.filter((_, i) => i !== index),
    });
  };

  const {toast} = useToast();

  const onSubmit = async () => {
    try {
      setLoading(true);
      addUpdatePlace()
      toast({
        title: "Place added successfully!",  
      });
      console.log("Submitted Data:", formData);
      // Handle submission logic
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: "Step 1",
      name: "Place Information",
    },
    {
      id: "Step 2",
      name: "Set up Notifications",
    },
    { id: "Step 3", name: "Complete" },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              console.log("Delete Place");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4 overflow-x-auto">
          {steps.map((step, index) => (
            <li key={step.id} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-start border-l-4 py-2 pl-4",
                  currentStep === index ? "border-sky-600" : "border-gray-200"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= index ? "text-sky-600" : "text-gray-500"
                  )}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="space-y-8 w-full">
        <div className={cn("w-full", currentStep === 1 ? "block" : "grid")}>
          {currentStep === 0 && (
            <>
              <div>
                <label>Place Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Dhaka"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Latitude</label>
                  <Input
                    name="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Latitude"
                  />
                </div>

                <div>
                  <label>Longitude</label>
                  <Input
                    name="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Longitude"
                  />
                </div>
              </div>

              <div>
                <label>Select Area on Map</label>
                <MapSelection 
                  onLatLongChange={(lat, long, geojson) => {
                    setFormData({
                      ...formData,
                      latitude: lat.toFixed(6),
                      longitude: long.toFixed(6),
                      geojson,
                    });
                  }}
                  initialGeoJSON={formData.geojson}
                />
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              {formData.notifications.map((notification, index) => (
                <Accordion
                  type="single"
                  collapsible
                  key={index}
                  className="mb-4"
                >
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger>
                      <span>{`Set Notification ${index + 1}`}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(index);
                        }}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <div>
                          <label>Satellite</label>
                          <Select
                            value={notification.satellite}
                            onValueChange={(value) =>
                              handleNotificationChange(index, "satellite", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select satellite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Landsat-8">Landsat-8</SelectItem>
                              <SelectItem value="Landsat-9">Landsat-9</SelectItem>
                              <SelectItem value="Sentinel 2">
                                Sentinel 2
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label>Notify Before (Hours)</label>
                          <Input
                            type="number"
                            min="0"
                            value={notification.notifyBefore}
                            onChange={(e) =>
                              handleNotificationChange(
                                index,
                                "notifyBefore",
                                e.target.value
                              )
                            }
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <label>Notify In</label>
                          <Select
                            value={notification.notifyIn}
                            onValueChange={(value) =>
                              handleNotificationChange(index, "notifyIn", value)
                            }
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="in-app">In-App</SelectItem>
                              <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {["sms", "all"].includes(notification.notifyIn) && (
                          <div>
                            <label>SMS Number</label>
                            <Input
                              type="tel"
                              value={notification.smsNumber}
                              onChange={(e) =>
                                handleNotificationChange(
                                  index,
                                  "smsNumber",
                                  e.target.value
                                )
                              }
                              disabled={loading}
                              placeholder="+1234567890"
                            />
                          </div>
                        )}

                        {["email", "all"].includes(notification.notifyIn) && (
                          <div>
                            <label>Email</label>
                            <Input
                              type="email"
                              value={notification.email}
                              onChange={(e) =>
                                handleNotificationChange(index, "email", e.target.value)
                              }
                              disabled={loading}
                              placeholder="example@domain.com"
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}

              <Button
                type="button"
                className="flex items-center"
                size="lg"
                onClick={addNotification}
                disabled={loading}
              >
                Add More Notification
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h2 className="text-lg font-semibold text-green-700 mb-2">
                Compiled Successfully!
              </h2>
              <DataDisplay formData={formData} />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            onClick={prev}
            disabled={currentStep === 0 || loading}
            variant="outline"
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 && (
            <Button
              type="button"
              onClick={next}
              disabled={loading}
              variant="primary"
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="button" onClick={onSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
