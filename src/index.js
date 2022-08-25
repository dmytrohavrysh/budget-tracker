import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "./index.css";
import { SettingsProvider } from './providers/context/Settings';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './providers/context/Auth';

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SettingsProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
              <App/>
              <ReactQueryDevtools></ReactQueryDevtools>
          </QueryClientProvider>
        </AuthProvider>
    </SettingsProvider>);
    
    