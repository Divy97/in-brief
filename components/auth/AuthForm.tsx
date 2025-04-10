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

export function AuthForm() {
  const { signInWithGoogle } = useAuthContext();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome to InBrief</CardTitle>
        <CardDescription>
          Sign in with Google to create and manage your quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button
            variant="outline"
            onClick={signInWithGoogle}
            className="w-full"
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
