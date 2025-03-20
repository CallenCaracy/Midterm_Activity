import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";

const prisma = new PrismaClient();
const pubsub = new PubSub();

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    userId: ID!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, userId: ID!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Post!
  }

  type Subscription {
    postCreated: Post!
  }
`;

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_, { id }) => prisma.post.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createPost: async (_, { title, content, userId }) => {
      const newPost = await prisma.post.create({ 
        data: { title, content, userId: Number(userId) }
      });
      console.log("Publishing POST_CREATED:", newPost); // <-- Log here
      pubsub.publish("POST_CREATED", { postCreated: newPost });
      return newPost;
    },
    updatePost: (_, { id, title, content }) =>
      prisma.post.update({ where: { id: Number(id) }, data: { title, content } }),
    deletePost: (_, { id }) => prisma.post.delete({ where: { id: Number(id) } }),
  },
  Subscription: {
    postCreated: {
      subscribe: () => {
        console.log("Subscription resolver triggered!");
        return pubsub.asyncIterator(["POST_CREATED"]);
      },
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer({ schema, context: () => ({ pubsub }) }, wsServer);

const server = new ApolloServer({
  schema,
  context: () => ({ pubsub }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(4002, () => {
    console.log(`🚀 Posts service running at http://localhost:4002/graphql`);
  });
})();