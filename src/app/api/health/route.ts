import { graphqlClient } from "@/lib/graphql";
import { gql } from "graphql-request";
import { SignJWT } from "jose";

// Import the key from auth.ts or create it here
const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// Modified query to check table existence
const HEALTH_CHECK = gql`
  query HealthCheck {
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export async function GET() {
  try {
    // Test database connection
    const dbResult = await graphqlClient.request(HEALTH_CHECK);

    // Test JWT
    const testToken = await new SignJWT({ test: true })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1m")
      .sign(key);

    return Response.json({
      status: "healthy",
      database: "connected",
      jwt: "working",
      dbResult,
      testToken,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : String(error),
        details: error, // Add this for debugging
      },
      { status: 500 }
    );
  }
}
