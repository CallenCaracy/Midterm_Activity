import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo-client";
import NewPosts from "./NewPosts";
import PostsTable from "./PostsTable";
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="container">
        <h1>Posts</h1>
        <PostsTable /> {/* Your component to display posts */}  
        <NewPosts />   {/* Subscription component for new posts */}  
      </div>
    </ApolloProvider>
  );
}

export default App;
