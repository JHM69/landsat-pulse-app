'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, splitLink, getFetch, loggerLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { trpc } from './trpc';
import queryClient from './query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {  

  const trpcHttpUrl = 'http://localhost:3000/api/trpc/';
  
  const wsClient = createWSClient({
    url: 'ws://localhost:3000/api/trpc/', // Updated to ws://
  });
 
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          
          true: wsLink({
            client: wsClient,
          }),
          false: httpBatchLink({
            url: trpcHttpUrl,
          }),
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
