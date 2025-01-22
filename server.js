import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import helperRouter from "./routes/helperRoutes.js";
import providerRouter from "./routes/providerRoutes.js";
import clientRouter from "./routes/clientRoutes.js";

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

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
