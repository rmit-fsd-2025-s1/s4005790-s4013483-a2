import "reflect-metadata";
import express from "express";
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

const app = express();
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

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use("/graphql", expressMiddleware(apolloServer));

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);