import { gql } from "graphql-request";

export const GET_USER = gql`
  query GetUser($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      image
    }
  }
`;

export const GET_USER_VIDEOS = gql`
  query GetUserVideos($userId: uuid!) {
    videos(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      title
      url
      thumbnail
      duration
      summary
      created_at
    }
  }
`;
