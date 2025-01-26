import type { AuthOptions, DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { HasuraAdapter } from "@auth/hasura-adapter";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
    provider?: string;
  }
}

export const authOptions: AuthOptions = {
  debug: true,
  adapter: HasuraAdapter({
    endpoint: process.env.NEXT_PUBLIC_HASURA_ENDPOINT!,
    adminSecret: process.env.HASURA_ADMIN_SECRET!,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      console.log("[NextAuth] SignIn Callback - Account:", account);
      console.log("[NextAuth] SignIn Callback - User:", user);
      return true;
    },
    async jwt({ token, user, account }) {
      console.log("[NextAuth] JWT Callback - Token:", token);
      console.log("[NextAuth] JWT Callback - User:", user);
      console.log("[NextAuth] JWT Callback - Account:", account);

      if (account && user) {
        token.provider = account.provider;
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth] Session Callback - Session:", session);
      console.log("[NextAuth] Session Callback - Token:", token);

      if (session.user) {
        session.user.id = token.id as string;
        session.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth] Redirect Callback - URL:", url);
      console.log("[NextAuth] Redirect Callback - BaseURL:", baseUrl);

      if (url.includes("/login")) {
        return `${baseUrl}/dashboard`;
      }

      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
