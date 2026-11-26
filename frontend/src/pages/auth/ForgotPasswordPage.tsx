import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { AuthHeading, AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import GoogleButton from '@/components/buttons/GoogleButton'
import { Button } from '@/components/ui/button'

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthSplitLayout>
      <div className="space-y-8">
        <AuthHeading
          icon={KeyRound}
          title="Forgot your password?"
          description="Self-service password reset isn't available yet."
        />

        <div className="space-y-2 rounded-xl border bg-muted/50 p-4 text-sm">
          <p className="font-medium text-foreground">Signed up with Google?</p>
          <p className="text-muted-foreground">
            You don&apos;t need a password — just continue with Google. Otherwise, ask your Invoicer
            administrator to reset your password for you.
          </p>
        </div>

        <div className="space-y-3">
          <GoogleButton />
          <Button asChild variant="ghost" className="h-10 w-full">
            <Link to="/login">
              <ArrowLeft />
              Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    </AuthSplitLayout>
  )
}

export default ForgotPasswordPage
