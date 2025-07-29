import { Button } from '@/components/ui/button';

const GoogleButton = () => {

  function redirectToGoogleLogin() {
    console.log("Redirecting to google login")
    const state = "testsecretstate"
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      redirect_uri: "http://localhost:8000/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
      state
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  return (
    <Button
      onClick={redirectToGoogleLogin}
    >
      Sign-in with Google
    </Button>
  );
}

export default GoogleButton;
