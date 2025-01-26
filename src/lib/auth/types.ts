export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  subscription_tier?: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResult {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    type: "AuthError";
    message: string;
    errors?: Array<{
      message: string;
      path: string[];
    }>;
  };
}
