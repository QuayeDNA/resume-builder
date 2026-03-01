import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#0f0f1c',
          color: '#c8c8e8',
          border: '1px solid #1e1e35',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '12px',
        },
        success: { iconTheme: { primary: '#4ade80', secondary: '#0f0f1c' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#0f0f1c' } },
      }}
    />
  </React.StrictMode>,
)
