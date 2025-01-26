import { gql } from "graphql-request";

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!) {
    insert_users_one(object: { email: $email, name: $name }) {
      id
      email
      name
    }
  }
`;

export const CREATE_VIDEO = gql`
  mutation CreateVideo(
    $title: String!
    $url: String!
    $userId: uuid!
    $duration: Int!
  ) {
    insert_videos_one(
      object: {
        title: $title
        url: $url
        user_id: $userId
        duration: $duration
      }
    ) {
      id
      title
      url
      duration
    }
  }
`;
