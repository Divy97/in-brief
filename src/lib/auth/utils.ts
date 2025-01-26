"use client";

import {
  type AuthResult,
  type LoginCredentials,
  type RegisterCredentials,
} from "./types";

const API_BASE = "/api/auth";

export async function login(
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          type: "AuthError",
          message: errorData.error?.message || "Failed to login",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: {
        type: "AuthError",
        message: "An unexpected error occurred",
      },
    };
  }
}

export async function register(
  credentials: RegisterCredentials
): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          type: "AuthError",
          message: errorData.error?.message || "Failed to register",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: {
        type: "AuthError",
        message: "An unexpected error occurred",
      },
    };
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getSession(): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      credentials: "include",
    });

    if (!response.ok) {
      return {
        success: false,
        error: {
          type: "AuthError",
          message: "No active session",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: {
        type: "AuthError",
        message: "Failed to get session",
      },
    };
  }
}

export async function getAnonymousUsage(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/anonymous/usage`, {
      credentials: "include",
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.usage_count;
  } catch {
    return 0;
  }
}
