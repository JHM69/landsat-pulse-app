
import { TypeOf, number, object, string } from 'zod';


export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
  from: string().optional(),
  to: string().optional(),
  symbol: string().optional(),
  comment: string().optional(),
  env: string().optional(),
  status: string().optional(),
  start_hh : number().optional(),
  start_mm : number().optional(),
  end_hh : number().optional(),
  end_mm : number().optional(),
});

export type FilterQueryInput = TypeOf<typeof filterQuery>;
