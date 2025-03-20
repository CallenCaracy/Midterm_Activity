import React, { useEffect } from "react";
import { useSubscription, gql } from "@apollo/client";

const POST_CREATED_SUBSCRIPTION = gql`
  subscription OnPostCreated {
    postCreated {
      id
      title
      content
      userId
    }
  }
`;

function NewPosts() {
  const { data, loading, error } = useSubscription(POST_CREATED_SUBSCRIPTION);

  useEffect(() => {
    if (data) {
      console.log("Subscription data:", data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>New Post</h2>
      {data && (
        <div>
          <p>ID: {data.postCreated.id}</p>
          <p>Title: {data.postCreated.title}</p>
          <p>Content: {data.postCreated.content}</p>
          <p>User ID: {data.postCreated.userId}</p>
        </div>
      )}
    </div>
  );
}

export default NewPosts;