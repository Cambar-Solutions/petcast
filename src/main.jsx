import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/shared/lib/queryClient'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4b5563',
            color: '#f9fafb',
          },
          success: {
            style: {
              background: '#4b5563',
              color: '#f9fafb',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              color: '#fef2f2',
            },
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
