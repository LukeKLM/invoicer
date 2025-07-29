import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon, User2Icon } from 'lucide-react'
import Cookies from "js-cookie"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLayout } from "@/contexts/LayoutContext";


export function MainMenu() {

  const { headerContent } = useLayout();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const links = [
    {
      title: "Invoices",
      url: "/invoices",
    },
    {
      title: "Customers",
      url: "/customers",
    },
    {
      title: "Suppliers",
      url: "/suppliers",
    }
  ]

  const logout = () => {
    Cookies.remove("access_token");
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <div>{headerContent}</div>
          {isClient && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DropdownMenuTrigger asChild>
                  <div>
                    <span className="sr-only">Open menu</span>
                    <User2Icon className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={() => logout()}>
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden">
              <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="md:hidden">
            <SheetTitle>Menu</SheetTitle>
            <div className="grid gap-4 p-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  {link.title}
                </Link>
              ))}
              <Button variant="ghost" onClick={() => logout}>
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav >
  )
}
