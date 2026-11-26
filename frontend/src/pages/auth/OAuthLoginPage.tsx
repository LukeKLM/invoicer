import { setAccessToken } from '@/lib/services/authService';
import React, { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import GoogleButton from '@/components/buttons/GoogleButton';

const OAuthLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      navigate("/invoices", { replace: true });
    }
  }, [navigate, token]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4 py-10">
      <Logo />
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 text-center shadow-sm">
        {token ? (
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="size-5 animate-spin" />
            </span>
            <div className="space-y-1">
              <h1 className="text-base font-semibold text-foreground">Signing you in…</h1>
              <p className="text-sm text-muted-foreground">Hang tight, we&apos;re preparing your workspace.</p>
            </div>
          </div>
        ) : (
          <div role="alert" className="flex flex-col items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
            <div className="space-y-1">
              <h1 className="text-base font-semibold text-foreground">We couldn&apos;t sign you in</h1>
              <p className="text-sm text-muted-foreground">
                The sign-in link is missing its access token. It may have expired or been cancelled — please try again.
              </p>
            </div>
            <div className="mt-2 w-full space-y-2">
              <GoogleButton label="Try again with Google" />
              <Button asChild variant="ghost" className="h-10 w-full">
                <Link to="/login" replace>
                  <ArrowLeft />
                  Back to sign in
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OAuthLoginPage
