import { filterQuery } from './order-schema';
import { getPlacesHandler } from './order-controller';
import { t } from '@/utils/trpc-server';
 

const orderRouter = t.router({
  getPlaces: t.procedure
    .input(filterQuery)
    .query(({ input }) => getPlacesHandler({ filterQuery: input })),
});




export default orderRouter;
