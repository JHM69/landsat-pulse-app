import Email from 'next-auth/providers/email';
import { TypeOf, number, object, string } from 'zod';


export const filterQuery = object({
  limit: number().default(1),
  page: number().default(10),
  search: string().optional(),
  email: string().email(),
});

export type FilterQueryInput = TypeOf<typeof filterQuery>;
