import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Menu } from './components/Menu';
import { useQueryClient } from './hooks/useQueryClient';
import { AppRoutes } from './routes';
import { innerLayoutStyle, layoutStyle } from './style/global.css';
import './style/index.css';

function App() {
  const queryClient = useQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={layoutStyle}>
        <Menu />

        <div className={innerLayoutStyle}>
          <AppRoutes />
        </div>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
