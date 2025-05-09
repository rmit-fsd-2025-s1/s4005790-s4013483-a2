import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import lecturerRoutes from "./routes/lecturer.routes";
import tutorRoutes from "./routes/tutor.routes";
import lecturerProfileRoutes from "./routes/lecturerProfile.routes";
import courseRoutes from "./routes/course.routes";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", lecturerRoutes);
app.use("/api", tutorRoutes);
app.use("/api", lecturerProfileRoutes);
app.use("/api", courseRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
