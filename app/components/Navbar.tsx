"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Navbar() {
  const { isAuthenticated, signOut, loading, user } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle hydration mismatch by only rendering after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle sign out with confirmation
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "h-16 border-b bg-white/90 backdrop-blur-md shadow-sm"
          : "h-20 border-b bg-white/75 backdrop-blur-sm"
      )}
    >
      <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          InBrief
        </Link>

        <div className="flex items-center gap-4">
          {!mounted ? (
            <Skeleton className="h-9 w-20 rounded-md" />
          ) : loading ? (
            <Skeleton className="h-9 w-20 rounded-md" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {user?.email?.[0]?.toUpperCase() || (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-500">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 w-full"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 w-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
