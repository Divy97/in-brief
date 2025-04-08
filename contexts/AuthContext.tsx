"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAuth, UseAuthReturn } from "@/hooks/useAuth";
import { useQuizLimits, UseQuizLimitsReturn } from "@/hooks/useQuizLimits";

interface AuthContextType extends UseAuthReturn {
  quizLimits: UseQuizLimitsReturn;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const quizLimits = useQuizLimits();

  return (
    <AuthContext.Provider value={{ ...auth, quizLimits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
