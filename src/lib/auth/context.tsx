"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Session, type AuthResult } from "./types";
import { getSession, login, logout, register } from "./utils";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  login: typeof login;
  logout: () => Promise<void>;
  register: typeof register;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const result = await getSession();
      if (result.success) {
        setSession(result.data);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (...args: Parameters<typeof login>) => {
    const result = await login(...args);
    if (result.success) {
      setSession(result.data);
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  const handleRegister = async (...args: Parameters<typeof register>) => {
    const result = await register(...args);
    if (result.success) {
      setSession(result.data);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
