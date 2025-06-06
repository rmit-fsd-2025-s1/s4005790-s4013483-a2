import "reflect-metadata";
import express, { json } from "express";
import { AppDataSource } from "./data-source";
import lecturerRoutes from "./routes/lecturer.routes";
import tutorRoutes from "./routes/tutor.routes";
import lecturerProfileRoutes from "./routes/lecturerProfile.routes";
import courseRoutes from "./routes/course.routes";
import applicationRoutes from "./routes/application.routes";
import tutorProfileRoutes from "./routes/tutorProfile.routes";
import cors from "cors";
import preferenceRoutes from "./routes/preference.routes";
import notificationRoutes from "./routes/notification.routes";
import adminRoutes from "./routes/admin.routes";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import lecturerAnalyticsRoutes from "./routes/lecturerAnalytics.routes";
import { WebSocketServer } from "ws";
import http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", lecturerRoutes);
app.use("/api", tutorRoutes);
app.use("/api", lecturerProfileRoutes);
app.use("/api", courseRoutes);
app.use("/api", applicationRoutes);
app.use("/api", tutorProfileRoutes);
app.use("/api", preferenceRoutes);
app.use("/api", notificationRoutes);
app.use("/api", adminRoutes);
app.use("/api", lecturerAnalyticsRoutes);

async function startServer() {
  const ws = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const serverCleanup = useServer({ schema }, ws);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer)
  );

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");


  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);