import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useQueryClient } from './hooks/useQueryClient';
import { AppRoutes } from './routes';
import { innerLayoutStyle, layoutStyle } from './style/global.css';
import './style/index.css';
import { useStoreFandoms } from './stores/storeFandoms';
import { useEffect } from 'react';

function App() {
  const queryClient = useQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={layoutStyle}>
        <div className={innerLayoutStyle}>
          <AppRoutes />
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
