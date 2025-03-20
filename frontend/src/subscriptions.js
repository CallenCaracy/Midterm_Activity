import { gql } from "@apollo/client";

export const POST_CREATED_SUBSCRIPTION = gql`
  subscription {
    postCreated {
      id
      title
      content
      userId
    }
  }
`;
