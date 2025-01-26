import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type User } from "./types";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

const COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY = "24h";

const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function createSession(user: User): Promise<string> {
  // Create a JWT token
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    subscription_tier: user.subscription_tier,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  // Set the cookie with secure options
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return token;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as User;
  } catch {
    // If token is invalid or expired, clear it
    cookieStore.delete(COOKIE_NAME);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
