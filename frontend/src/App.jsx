import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
      userId
    }
  }
`;

function App() {
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS, { fetchPolicy: "cache-and-network" });
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS, { fetchPolicy: "cache-and-network" });

  if (usersLoading || postsLoading) return <p>Loading...</p>;
  if (usersError || postsError) return <p>Error: {usersError?.message || postsError?.message}</p>;

  const users = usersData?.users || [];
  const posts = postsData?.posts || [];

  return (
    <div>
      <h1>Users and Their Posts</h1>
      <table border="1">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <ul>
                  {posts
                    .filter((post) => post.userId === user.id)
                    .map((post) => (
                      <li key={post.id}>{post.title}</li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
