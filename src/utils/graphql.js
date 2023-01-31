import gql from "graphql-tag";
export const FETCH_POST_QUERY = gql`
  {
    getPosts {
      body
      username
      id
      createdAt
      likes {
        username
        createdAt
      }
      comments {
        createdAt
        username
        body
        id
      }
      likesCount
      commentsCount
    }
  }
`;
