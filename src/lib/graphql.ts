import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.NEXT_PUBLIC_HASURA_ENDPOINT || "http://localhost:8082/v1/graphql";

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
  },
});
