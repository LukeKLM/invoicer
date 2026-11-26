import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutProvider } from './contexts/LayoutContext'
import { AppShell } from './components/layout/AppShell'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import OAuthLoginPage from './pages/auth/OAuthLoginPage'

// Main app pages
import HomePage from './pages/HomePage'
import InvoicesPage from './pages/InvoicesPage'
import InvoiceDetailPage from './pages/InvoiceDetailPage'
import CustomersPage from './pages/CustomersPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import SuppliersPage from './pages/SuppliersPage'
import SupplierDetailPage from './pages/SupplierDetailPage'
import SkipPayCalculatorPage from './pages/SkipPayCalculatorPage'
import SettingsPage from './pages/SettingsPage'

// Auth wrapper component
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="min-h-dvh bg-background">{children}</div>
}

// Protected layout with the app shell (sidebar + top bar)
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <AppShell>{children}</AppShell>
    </LayoutProvider>
  )
}

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      } />
      <Route path="/forgot-password" element={
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      } />
      <Route path="/oauth-login" element={
        <AuthLayout>
          <OAuthLoginPage />
        </AuthLayout>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <HomePage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <InvoicesPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/invoices/:id" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <InvoiceDetailPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <CustomersPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/customers/:id" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <CustomerDetailPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/suppliers" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <SuppliersPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/suppliers/:id" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <SupplierDetailPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/calculator" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <SkipPayCalculatorPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <ProtectedLayout>
            <SettingsPage />
          </ProtectedLayout>
        </ProtectedRoute>
      } />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
