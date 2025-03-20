import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    users: [User!]!
    user(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): User!
  }
`;

const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (_, { id }) => await prisma.user.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createUser: async (_, { name, email }) => prisma.user.create({ data: { name, email } }),
    updateUser: async (_, { id, name, email }) =>
      prisma.user.update({ where: { id: Number(id) }, data: { name, email } }),
    deleteUser: async (_, { id }) => prisma.user.delete({ where: { id: Number(id) } }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(4001).then(({ url }) => console.log(`🚀 Users service running at ${url}`));
