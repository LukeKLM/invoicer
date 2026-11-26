import React from 'react'
import { LoginForm } from "@/components/loginForm"
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout"

const LoginPage: React.FC = () => {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  )
}

export default LoginPage
