import { useSubscription } from "@apollo/client";
import { POST_CREATED_SUBSCRIPTION } from "./subscriptions";

const NewPosts = () => {
  const { data, loading } = useSubscription(POST_CREATED_SUBSCRIPTION);

  console.log("Subscription data:", data); // Log subscription data

  if (loading) return <p>Waiting for new posts...</p>;

  return (
    <div>
      <h2>New Post:</h2>
      <p>Title: {data?.postCreated.title}</p>
      <p>Content: {data?.postCreated.content}</p>
    </div>
  );
};

export default NewPosts;
