const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const cors = require("cors");
// SDK de Mercado Pago
const mercadopago = require("mercadopago");

const { graphqlUploadExpress } = require("graphql-upload");

const { UserController } = require("./controllers");
const env = require("./config/env");

const { globalTypeDefs, globalResolvers } = require("./schema");

async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      context: async ({ req }) => {
        try {
          // get the user token from the headers
          const token = req.headers.authorization || "";
          if (!token) {
            return { user: null };
          }
          // try to retrieve a user with the token
          const user = await UserController.getUserByToken(
            token.replace("Bearer ", "")
          );
          return { user };
        } catch (error) {
          return { user: null };
        }
      },
    });
    await server.start();
    // This middleware should be added before calling `applyMiddleware`.
    app.use(cors());

    app.use(graphqlUploadExpress());
    server.applyMiddleware({ app });
    const { NODE_ENV, HOST, PORT } = env;
    await new Promise((resolve) =>
      httpServer.listen({ port: PORT, host: HOST }, resolve)
    );

    mercadopago.configure({
      access_token: env[NODE_ENV].mercadoPago,
    });
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  } catch (error) {
    console.error({ error });
  }
}

startApolloServer(globalTypeDefs, globalResolvers);
