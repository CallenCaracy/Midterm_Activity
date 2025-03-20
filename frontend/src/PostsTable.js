import React, { useEffect } from "react";
import { useQuery, useSubscription, gql } from "@apollo/client";
import './App.css';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
    }
  }
`;

const POST_SUBSCRIPTION = gql`
  subscription OnPostCreated {
    postCreated {
      id
      title
      content
    }
  }
`;

const PostsTable = () => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const { data: newPostData } = useSubscription(POST_SUBSCRIPTION);

  useEffect(() => {
    if (newPostData) {
      refetch();
    }
  }, [newPostData, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Content</th>
        </tr>
      </thead>
      <tbody>
        {data.posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.title}</td>
            <td>{post.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PostsTable;
