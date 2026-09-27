import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode >,
);
