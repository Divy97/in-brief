"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";

export function NextAuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  // Debug: Log session details
  console.log("SessionProvider - Session:", {
    exists: !!session,
    user: session?.user,
  });

  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
