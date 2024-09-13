import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routers";

dotenv.config();

const app = express();
const port = 9090;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router());

const server = http.createServer(app);

(async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
    process.exit(1);
  }
})();
