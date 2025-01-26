import { graphqlClient } from "@/lib/graphql";
import { CREATE_USER } from "@/lib/graphql/mutations";

export async function GET() {
  try {
    const result = await graphqlClient.request(CREATE_USER, {
      email: "test@example.com",
      name: "Test User",
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
