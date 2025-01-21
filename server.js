import express from "express";
import path from "path"; // Import path module
import fs from "fs";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import helperRouter from "./routes/helperRoutes.js";
import providerRouter from "./routes/providerRoutes.js";
import clientRouter from "./routes/clientRoutes.js";

// Debug path resolution
console.log(
  "Looking for helperController.js at:",
  path.resolve("./controller/helperController.js")
);
console.log(
  "File exists:",
  fs.existsSync(path.resolve("./controller/helperController.js"))
);

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// APIs
app.use("/api/helper", helperRouter);
app.use("/api/provider", providerRouter);
app.use("/api/client", clientRouter);

app.get("/", (req, res) => {
  res.send("API WORKS");
});

app.listen(port, () => {
  console.log("SERVER IS STARTED, PORT: " + port);
});
