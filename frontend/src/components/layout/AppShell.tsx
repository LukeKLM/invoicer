import { ReactNode, useMemo, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Calculator,
  ChevronsUpDown,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Monitor,
  Moon,
  Settings,
  Sun,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearAccessToken, getAccessToken, getTokenSubject } from "@/lib/auth"
import { useLayout } from "@/contexts/LayoutContext"
import { Theme, useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import usePrivacyStore from "@/stores/usePrivacyStore"

type NavItem = { title: string; url: string; icon: LucideIcon }

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Billing",
    items: [
      { title: "Invoices", url: "/invoices", icon: FileText },
      { title: "Customers", url: "/customers", icon: Users },
      { title: "Suppliers", url: "/suppliers", icon: Truck },
    ],
  },
  {
    label: "Tools",
    items: [{ title: "Calculator", url: "/calculator", icon: Calculator }],
  },
]

const settingsItem: NavItem = { title: "Settings", url: "/settings", icon: Settings }

const allItems = [...navGroups.flatMap((g) => g.items), settingsItem]

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-sm">
        <FileText className="size-4" />
      </span>
      <span className="text-[15px]">Invoicer</span>
    </Link>
  )
}

function NavLinkItem({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.url}
      end={item.url === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
          {item.title}
        </>
      )}
    </NavLink>
  )
}

const themeOptions: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex items-center rounded-lg border bg-muted/40 p-0.5" role="radiogroup" aria-label="Theme">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex h-7 flex-1 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
            theme === option.value && "bg-card text-foreground shadow-xs"
          )}
        >
          <option.icon className="size-3.5" />
        </button>
      ))}
    </div>
  )
}

function PrivacyToggle() {
  const { hidden, toggleHidden } = usePrivacyStore()
  const label = hidden ? "Show amounts" : "Hide amounts"
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleHidden}
      aria-pressed={hidden}
      aria-label={label}
      title={label}
      className={cn(hidden && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary")}
    >
      {hidden ? <EyeOff /> : <Eye />}
    </Button>
  )
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const email = useMemo(() => {
    const token = getAccessToken()
    return (token && getTokenSubject(token)) || "Account"
  }, [])
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left text-sm transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </span>
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">{email}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="truncate text-sm font-medium">{email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings"><Settings className="size-4" /> Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarContent({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navGroups.map((group, i) => (
          <div key={i} className="space-y-1">
            {group.label && (
              <div className="px-2.5 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <NavLinkItem key={item.url} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>
      <div className="space-y-3 border-t border-sidebar-border p-3">
        <NavLinkItem item={settingsItem} onNavigate={onNavigate} />
        <ThemeSwitch />
        <UserMenu onLogout={onLogout} />
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { headerContent } = useLayout()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logout = () => {
    clearAccessToken()
    navigate("/login")
  }

  const current = allItems
    .filter((item) => item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url))
    .at(0)

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent onLogout={logout} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="-ml-1 lg:hidden">
                <MenuIcon className="size-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0 lg:hidden">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={logout} />
            </SheetContent>
          </Sheet>
          <div className="flex min-w-0 items-center gap-2 text-sm">
            {current && <current.icon className="size-4 text-muted-foreground" />}
            <span className="truncate font-medium">{current?.title ?? "Invoicer"}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {headerContent}
            <PrivacyToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
