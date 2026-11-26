import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { AuthHeading, AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import GoogleButton from '@/components/buttons/GoogleButton'

const linkClass =
  "rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

const RegisterPage: React.FC = () => {
  return (
    <AuthSplitLayout>
      <div className="space-y-8">
        <AuthHeading
          icon={Sparkles}
          title="Create your account"
          description="Invoicer accounts are created with Google. Continue with your Google account and your workspace is set up automatically on first sign-in."
        />

        <div className="space-y-3">
          <GoogleButton label="Sign up with Google" />
          <p className="text-xs text-muted-foreground">
            No separate password needed — we only use your name and email address from Google.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  )
}

export default RegisterPage
