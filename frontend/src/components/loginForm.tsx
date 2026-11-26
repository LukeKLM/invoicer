import React, { useState } from "react"
import { Link, useLocation, useNavigate, type Location } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { InputField } from "./forms_inputs/inputField"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/services/authService"
import GoogleButton from "./buttons/GoogleButton"
import { AuthHeading } from "./auth/AuthSplitLayout"
import { InlineError } from "@/components/ui/inline-error"

const INVALID_CREDENTIALS = "Incorrect email or password. Please try again."

function loginErrorMessage(error: unknown): string {
  // fetchClient throws "Fetch error (status: NNN)" for non-2xx responses
  const status = error instanceof Error ? Number(/status: (\d+)/.exec(error.message)?.[1]) : NaN
  if (status >= 400 && status < 500) return INVALID_CREDENTIALS
  if (status >= 500) return "The server ran into a problem. Please try again in a moment."
  return "We couldn't reach the server. Check your connection and try again."
}

export const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTarget = () => {
    const from = (location.state as { from?: Location } | null)?.from
    if (!from?.pathname || from.pathname === "/login") return "/invoices"
    return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const logged: boolean = await login(formData.email, formData.password)
      if (logged) {
        navigate(redirectTarget(), { replace: true })
        return
      }
      setError(INVALID_CREDENTIALS)
    } catch (err) {
      setError(loginErrorMessage(err))
    }
    setPending(false)
  }

  const setField = (name: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  return (
    <div className="space-y-8">
      <AuthHeading title="Welcome back" description="Sign in to your Invoicer account to continue." />

      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <InlineError>{error}</InlineError>
        )}

        <InputField
          id="email"
          name="email"
          type="email"
          required={true}
          autoComplete={true}
          label="Email address"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password<span className="ml-0.5 text-destructive">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setField("password", e.target.value)}
              aria-invalid={error ? true : undefined}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="h-10 w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="space-y-5">
        <div className="relative flex items-center" role="separator" aria-label="or continue with">
          <div className="flex-1 border-t" />
          <span className="px-3 text-xs uppercase tracking-wide text-muted-foreground">or continue with</span>
          <div className="flex-1 border-t" />
        </div>
        <GoogleButton label="Google" />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
