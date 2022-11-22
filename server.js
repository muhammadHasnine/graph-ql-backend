import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import typeDefs from "./schema.js";
import connectDB from "./database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";
import http from "http";
const app = express();
const httpServer = http.createServer(app);
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}
connectDB();
import "./models/User.js";
import "./models/Quote.js";
import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      return { userId };
    }
  },
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    process.env.NODE_ENV !== "PRODUCTION"
      ? ApolloServerPluginLandingPageGraphQLPlayground()
      : ApolloServerPluginLandingPageDisabled(),
  ],
});
app.get("/",(req,res)=>{
  res.send("Working")
})
await server.start();
server.applyMiddleware({
     app,
     path:"/graphql" 
});
const port = process.env.PORT || 4000;
httpServer.listen({ port }, () => {
    console.log(`🚀 Server listening at:4000 ${server.graphqlPath}`);
  })
