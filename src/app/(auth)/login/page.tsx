"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const from = searchParams.get("from");

  useEffect(() => {
    if (from) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "default",
      });
    }
  }, [from, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tighter">
            Welcome to In-Brief
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard and profile
          </p>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
