import express from "express";
import httpGetAllPlanets from "./planets.controller.js";
const planetRouter = express.Router();

planetRouter.get("/", httpGetAllPlanets);

export default planetRouter;
