import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
      }
    `,
    resolvers: {
      Query: {
        hello: () => {
          return "Hi GraphQL";
        },
        say: (_, { name }) => {
          return `Hey ${name}, How are you?`;
        },
      },
      Mutation: {
        createUser: async (_, { firstName, lastName, email, password }) => {
          try {
            await prismaClient.user.create({
              data: {
                firstName,
                lastName,
                email,
                password,
                salt: "random salt",
              },
            });
            return true; // Return true to indicate successful creation
          } catch (error) {
            return false; // Return false if there's an error
          }
        },
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", json(), expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
