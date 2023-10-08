import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
import app from "./app.js";
const MONGO_URL = process.env.MONGO_URL;
import { loadPlanets } from "./models/planets.model.js";
import { loadLaunchData } from "./models/launches.model.js";
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection Ready");
});

mongoose.connection.on("error", (err) => console.log(err));

await mongoose.connect(MONGO_URL);
await loadPlanets();
await loadLaunchData();
server.listen(8000, () => {
  console.log("Listening...to");
});
