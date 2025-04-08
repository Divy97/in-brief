"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "../ui/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, error } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === "sign-in") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push(redirectTo);
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {type === "sign-in" ? "Sign in" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {type === "sign-in"
            ? "Enter your email and password to sign in"
            : "Enter your email and password to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          {error && <div className="text-sm text-red-500">{error.message}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type === "sign-in" ? "Sign in" : "Create account"}
          </Button>
          {type === "sign-in" ? (
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                href={{
                  pathname: "/sign-up",
                  query: { redirect_to: redirectTo },
                }}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link
                href={{
                  pathname: "/sign-in",
                  query: { redirect_to: redirectTo },
                }}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
