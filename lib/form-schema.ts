
import * as z from "zod";


const geojsonSchema = z.object({
  type: z.literal("Feature"),
  properties: z.object({}).optional(),
  geometry: z.object({
    type: z.string(),
    coordinates: z.any(), // Adjust based on your specific geometry requirements
  }),
});


export const placeSchema = z.object({
  id : z.number().nullable(),
  name : z.string(),
  latitude: z.string(),
  longitude: z.string(),
  geojson: z.any(),
  notifications : z.object({
    satellite : z.string(),
    notifyBefore: z.number(),
    notifyIn : z.string(),
    smsNumber : z.string(),
    email : z.string(),
  }),


  
});

export type ProfileFormValues = z.infer<typeof placeSchema>;
