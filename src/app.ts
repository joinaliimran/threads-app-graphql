import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({ typeDefs: ``, resolvers: {} });
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", json(), expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
