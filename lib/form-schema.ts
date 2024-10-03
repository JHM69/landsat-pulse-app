
import * as z from "zod";

export const placeSchema = z.object({
  name : z.string(),
  latitude: z.string(),
  longitude: z.string(),
  geojson: z.object({
    type: z.string(),
    features: z.array(z.any()),
  }).nullable(),

  notifications : z.object({
    satelite : z.string(),
    notifyBefore: z.number(),
    notifyIn : z.string(),
    smsNumber : z.string(),
    email : z.string(),
  }),


  
});

export type ProfileFormValues = z.infer<typeof placeSchema>;
