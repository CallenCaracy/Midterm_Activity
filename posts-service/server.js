import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
`;

const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_, { id }) => prisma.post.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createPost: (_, { title, content, userId }) =>
      prisma.post.create({ data: { title, content, userId: Number(userId) } }),
    updatePost: (_, { id, title, content }) =>
      prisma.post.update({ where: { id: Number(id) }, data: { title, content } }),
    deletePost: (_, { id }) => prisma.post.delete({ where: { id: Number(id) } }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4002).then(({ url }) => console.log(`🚀 Posts service running at ${url}`));
