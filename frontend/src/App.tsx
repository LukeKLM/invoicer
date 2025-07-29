import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutProvider } from './contexts/LayoutContext'
import { MainMenu } from './components/MainMenu'
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

// Auth wrapper component
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>
}

// Protected layout with MainMenu
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutProvider>
      <MainMenu />
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {children}
      </div>
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

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
