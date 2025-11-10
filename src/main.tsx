import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastProvider } from "@/context/ToastContext"
import { AccountProvider } from "@/context/AccountContext"
import { WatchlistProvider } from './context/WatchlistContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccountProvider>
      <WatchlistProvider> 
      <ToastProvider>
        <App />
      </ToastProvider>
      </WatchlistProvider> 
    </AccountProvider>
  </StrictMode>,
)
