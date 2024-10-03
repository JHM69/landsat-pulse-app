import { TypeOf, number, object, string } from 'zod';


export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
  from: string().optional(),
  to: string().optional(),
  symbol: string().optional(),
  comment: string().optional(),
});

export type FilterQueryInput = TypeOf<typeof filterQuery>;
