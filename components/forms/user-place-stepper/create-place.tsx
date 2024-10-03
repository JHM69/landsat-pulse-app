"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { placeSchema, type ProfileFormValues } from "@/lib/form-schema";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface ProfileFormType {
  initialData: any | null;
  categories: any;
}

export const CreatePlaceWithNotification: React.FC<ProfileFormType> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  const title = initialData ? "Edit product" : "Add New Place";
  const description = initialData
    ? "Edit a product."
    : "To create a new place to analyze and get notified, please add details of it here";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    name: "",
    latitude: "",
    longitude: "",
    geojson: null,
    notifications: [
      {
        satelite: "",
        notifyBefore: "",
        notifyIn: "",
        smsNumber: "",
        email: "",
      },
    ],
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "notifications",
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (formData) => {
    try {
      setLoading(true);
      // Handle form submission logic here
      console.log(formData);
      setData(formData);
      // Comment out the router.push for now, so we can see the final page
      // router.push(`/dashboard/places`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: "Step 1",
      name: "Place Information",
      fields: ["name", "latitude", "longitude", "geojson"],
    },
    {
      id: "Step 2",
      name: "Set up Notifications",
      fields: fields.flatMap((_, index) => [
        `notifications.${index}.satelite`,
        `notifications.${index}.notifyBefore`,
        `notifications.${index}.notifyIn`,
        `notifications.${index}.smsNumber`,
        `notifications.${index}.email`,
      ]),
    },
    { id: "Step 3", name: "Complete" },
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;
    await form.handleSubmit(onSubmit)();
    const output = await form.trigger(
      fields as Array<keyof ProfileFormValues>,
      {
        shouldFocus: true,
      },
    );

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(onSubmit)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

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
              /* Handle delete */
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={cn(
                  "flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  currentStep > index
                    ? "border-sky-600"
                    : currentStep === index
                    ? "border-sky-600"
                    : "border-gray-200",
                )}
                aria-current={currentStep === index ? "step" : undefined}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= index ? "text-sky-600" : "text-gray-500",
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div
            className={cn(
              currentStep === 1
                ? "md:inline-block w-full"
                : "md:grid md:grid-cols-3 gap-8",
            )}
          >
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Dhaka"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Latitude"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Longitude"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="geojson"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Select Area on Map</FormLabel>
                      <FormControl>
                        <MapSelection
                          onGeoJSONChange={(geojson) => {
                            field.onChange(geojson);
                          }}
                          onLatLongChange={(lat, long) => {
                            form.setValue("latitude", lat.toFixed(6));
                            form.setValue("longitude", long.toFixed(6));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                {fields.map((field, index) => (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    key={field.id}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={cn(
                          "[&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden relative !no-underline",
                          errors?.notifications?.[index] && "text-red-700",
                        )}
                      >
                        {`Set Notification ${index + 1}`}

                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-8"
                          onClick={() => remove(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {errors?.notifications?.[index] && (
                          <span className="absolute alert right-8">
                            <AlertTriangle className="h-4 w-4 text-red-700" />
                          </span>
                        )}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="md:grid md:grid-cols-3 gap-8 border p-4 rounded-md relative mb-4">
                          <FormField
                            control={form.control}
                            name={`notifications.${index}.satelite`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Satellite</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={loading}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select satellite" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Landsat-8">
                                      Landsat-8
                                    </SelectItem>
                                    <SelectItem value="Landsat-9">
                                      Landsat-9
                                    </SelectItem>
                                    <SelectItem value="Sentinel 2">
                                      Sentinel 2
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`notifications.${index}.notifyBefore`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notify Before hour</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    disabled={loading}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`notifications.${index}.notifyIn`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notify In</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={loading}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select notification method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sms">SMS</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="in-app">
                                      In-App
                                    </SelectItem>
                                    <SelectItem value="all">All</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {(form.watch(`notifications.${index}.notifyIn`) ===
                            "sms" ||
                            form.watch(`notifications.${index}.notifyIn`) ===
                              "all") && (
                            <FormField
                              control={form.control}
                              name={`notifications.${index}.smsNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SMS Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      disabled={loading}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {(form.watch(`notifications.${index}.notifyIn`) ===
                            "email" ||
                            form.watch(`notifications.${index}.notifyIn`) ===
                              "all") && (
                            <FormField
                              control={form.control}
                              name={`notifications.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      disabled={loading}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}

                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    className="flex justify-center"
                    size="lg"
                    onClick={() =>
                      append({
                        satelite: "",
                        notifyBefore: "",
                        notifyIn: "",
                        smsNumber: "",
                        email: "",
                      })
                    }
                  >
                    Add More Notification
                  </Button>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <div>
                <h1>Completed</h1>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={currentStep === steps.length - 1}
              >
                {currentStep === steps.length - 2 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
