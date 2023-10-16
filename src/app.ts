import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { json } from "body-parser";
import createApolloGraphQLServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    json(),
    expressMiddleware(await createApolloGraphQLServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const decodedData = UserService.decodeJWTToken(token as string);
          return decodedData;
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
