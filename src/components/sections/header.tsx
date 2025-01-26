"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function Header() {
  // const pathname = usePathname();
  const { data: session } = useSession();

  // const navigation = [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                className="fill-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                className="fill-primary/30"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                className="fill-primary/60"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
              In-Brief
            </span>
          </Link>
        </div>
        {/* <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav> */}
        <div className="flex flex-1 justify-end items-center space-x-4">
          {!session && (
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Sign Up
              </Button>
            </Link>
          )}
          {session && (
            <Link href="/profile">
              <Button
                variant="ghost"
                className="text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors gap-2"
              >
                <span>{session.user?.name}</span>
              </Button>
            </Link>
          )}
          <Link href="/summary">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-sm font-medium rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
