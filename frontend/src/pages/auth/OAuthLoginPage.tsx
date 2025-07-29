import { setAccessToken } from '@/lib/services/authService';
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";



const OAuthLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log(searchParams)
    const token = searchParams.get("token")
    if (token) {
      setAccessToken(token);
      navigate("/invoices", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  return null;
}

export default OAuthLoginPage
