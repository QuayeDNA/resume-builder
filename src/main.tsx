import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/*" element={<App />} />
        </Routes>
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
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
