 
import { t } from '@/utils/trpc-server';
import { filterQuery } from './dashboard-schema';
import { getDashboardHandler } from './dashboard-controller';
 

const dashboardRouter = t.router({
  getDashboard: t.procedure
    .input(filterQuery)
    .query(({ input }) => getDashboardHandler({ filterQuery: input })),
});




export default dashboardRouter;
