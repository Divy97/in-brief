# In-Brief Setup Guide

## Dependencies

### Core Dependencies

```bash
npm install next-auth@latest @auth/hasura-adapter
npm install @radix-ui/react-avatar class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot lucide-react
npm install @radix-ui/react-toast
npm install tailwindcss postcss autoprefixer
npm install shadcn-ui
```

## Database Schema (NextAuth.js with Hasura)

### Tables Structure

1. **users**

```sql
CREATE TABLE public.users (
  id UUID DEFAULT public.gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

2. **accounts**

```sql
CREATE TABLE public.accounts (
  id UUID DEFAULT public.gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  UNIQUE(provider, "providerAccountId")
);
```

3. **sessions**

```sql
CREATE TABLE public.sessions (
  id UUID DEFAULT public.gen_random_uuid() PRIMARY KEY,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);
```

4. **verification_tokens**

```sql
CREATE TABLE public.verification_tokens (
  token TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);
```

### Hasura Setup Commands

1. **Start Hasura with Docker**

```bash
docker run -d -p 8082:8080 \
  -e HASURA_GRAPHQL_METADATA_DATABASE_URL=postgres://postgres:postgrespassword@host.docker.internal:5432/postgres \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres:postgrespassword@host.docker.internal:5432/postgres \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_DEV_MODE=true \
  -e HASURA_GRAPHQL_ADMIN_SECRET=65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680 \
  hasura/graphql-engine:latest
```

2. **Track Tables**

```bash
curl -X POST 'http://localhost:8082/v1/metadata' \
-H 'Content-Type: application/json' \
-H 'x-hasura-admin-secret: 65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680' \
-d '{
  "type": "bulk",
  "args": [
    {
      "type": "pg_track_table",
      "args": {
        "source": "default",
        "table": "users"
      }
    },
    {
      "type": "pg_track_table",
      "args": {
        "source": "default",
        "table": "accounts"
      }
    },
    {
      "type": "pg_track_table",
      "args": {
        "source": "default",
        "table": "sessions"
      }
    },
    {
      "type": "pg_track_table",
      "args": {
        "source": "default",
        "table": "verification_tokens"
      }
    }
  ]
}'
```

3. **Set up Permissions for auth_service Role**

```bash
curl -X POST 'http://localhost:8082/v1/metadata' \
-H 'Content-Type: application/json' \
-H 'x-hasura-admin-secret: 65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680' \
-d '{
  "type": "bulk",
  "args": [
    {
      "type": "pg_create_select_permission",
      "args": {
        "table": "users",
        "role": "auth_service",
        "permission": {
          "columns": ["id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt"],
          "filter": {}
        }
      }
    },
    {
      "type": "pg_create_insert_permission",
      "args": {
        "table": "users",
        "role": "auth_service",
        "permission": {
          "check": {},
          "columns": ["id", "name", "email", "emailVerified", "image"]
        }
      }
    },
    {
      "type": "pg_create_select_permission",
      "args": {
        "table": "accounts",
        "role": "auth_service",
        "permission": {
          "columns": ["id", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state", "userId"],
          "filter": {}
        }
      }
    },
    {
      "type": "pg_create_insert_permission",
      "args": {
        "table": "accounts",
        "role": "auth_service",
        "permission": {
          "check": {},
          "columns": ["type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state", "userId"]
        }
      }
    },
    {
      "type": "pg_create_select_permission",
      "args": {
        "table": "sessions",
        "role": "auth_service",
        "permission": {
          "columns": ["id", "sessionToken", "userId", "expires"],
          "filter": {}
        }
      }
    },
    {
      "type": "pg_create_insert_permission",
      "args": {
        "table": "sessions",
        "role": "auth_service",
        "permission": {
          "check": {},
          "columns": ["sessionToken", "userId", "expires"]
        }
      }
    }
  ]
}'
```

## Environment Variables

Create a `.env.local` file with:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Hasura
NEXT_PUBLIC_HASURA_ENDPOINT=http://localhost:8082/v1/graphql
HASURA_ADMIN_SECRET=65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680
```

## NextAuth Configuration

File: `src/lib/auth/auth.config.ts`

```typescript
import { HasuraAdapter } from "@auth/hasura-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: HasuraAdapter({
    endpoint: process.env.NEXT_PUBLIC_HASURA_ENDPOINT!,
    adminSecret: process.env.HASURA_ADMIN_SECRET!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
```

## Middleware Configuration

File: `src/middleware.ts`

```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    console.log("Middleware:", {
      path: req.nextUrl.pathname,
      isAuth,
      isAuthPage,
      isDashboardPage,
    });

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth && isDashboardPage) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Session Handling

### Client-Side Session Check

```typescript
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <div>Protected content for {session.user.email}</div>;
}
```

### Common Session Errors

1. **[CLIENT_FETCH_ERROR] "No active session"**

   - Cause: Attempting to access protected content without being logged in
   - Solution:
     - Ensure proper middleware configuration
     - Check if session exists before accessing protected routes
     - Clear browser cookies and try logging in again
     - Verify NextAuth environment variables

2. **Session Not Persisting**

   - Clear all browser cookies
   - Check session maxAge in NextAuth config
   - Verify JWT secret is properly set
   - Ensure database tables have correct permissions

3. **Redirect Loops**
   - Check middleware conditions
   - Verify auth page paths in NextAuth config
   - Ensure proper handling of callback URLs

## Useful Commands

### Hasura Operations

```bash
# Reload Metadata
curl -X POST 'http://localhost:8082/v1/metadata' \
-H 'Content-Type: application/json' \
-H 'x-hasura-admin-secret: 65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680' \
-d '{"type": "reload_metadata", "args": {}}'

# Check Table Permissions
curl -X POST 'http://localhost:8082/v2/query' \
-H 'Content-Type: application/json' \
-H 'x-hasura-admin-secret: 65389efb3c9fbf86e0ec366a614eaeed05bfe9b81704fa6980aae73213285680' \
-d '{
  "type": "run_sql",
  "args": {
    "source": "default",
    "sql": "SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = '\''users'\''"
  }
}'
```

### Development

```bash
# Start Next.js Development Server
npm run dev

# Build Application
npm run build

# Start Production Server
npm start
```

## Troubleshooting

1. If encountering permission issues:

   - Clear Hasura metadata and reapply
   - Ensure all tables are properly tracked
   - Verify permissions for auth_service role

2. For authentication issues:

   - Clear browser cookies
   - Check environment variables
   - Verify Google OAuth configuration
   - Enable debug mode in NextAuth config

3. For database schema issues:
   - Ensure column names match NextAuth expectations
   - Verify foreign key constraints
   - Check table relationships in Hasura

## Additional Notes

1. Column names must be in camelCase for NextAuth compatibility:

   - `emailVerified` (not `email_verified`)
   - `userId` (not `user_id`)
   - `providerAccountId` (not `provider_account_id`)
   - `sessionToken` (not `session_token`)

2. Important Hasura configurations:

   - Enable console for development
   - Set admin secret
   - Configure CORS if needed
   - Set up proper permissions for auth_service role

3. NextAuth.js considerations:
   - Use JWT strategy for sessions
   - Configure callbacks for user ID handling
   - Set up proper error handling
   - Enable debug mode during development
