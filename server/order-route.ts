import { filterQuery } from './order-schema';
import { getPlacesHandler } from './order-controller';
import { t } from '@/utils/trpc-server';
import { z } from 'zod';
 
export const getPlacesInputSchema = z.object({
  email: z.string().email(),
});

const orderRouter = t.router({
  getPlaces: t.procedure
    .input(getPlacesInputSchema) // Use the defined schema with email
    .query(({ input }) => getPlacesHandler({ input })),
});



export default orderRouter;
