import express from "express";
import cors from "cors";
import path from "path";
import planetRouter from "./routes/planets/planets.router.js";
import launchesRouter from "./routes/launches/launches.router.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
//app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetRouter);
app.use("/launches", launchesRouter);

export default app;
