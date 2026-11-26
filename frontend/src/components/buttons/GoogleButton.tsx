import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GoogleButtonProps {
  label?: string;
  className?: string;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28v-3.1H1.27a12 12 0 0 0 0 10.76l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.27 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  );
}

const GoogleButton = ({ label = "Continue with Google", className }: GoogleButtonProps) => {

  function redirectToGoogleLogin() {
    const state = "testsecretstate"
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      redirect_uri: `${import.meta.env.VITE_API_URL}/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      state
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("h-10 w-full", className)}
      onClick={redirectToGoogleLogin}
    >
      <GoogleMark />
      {label}
    </Button>
  );
}

export default GoogleButton;
