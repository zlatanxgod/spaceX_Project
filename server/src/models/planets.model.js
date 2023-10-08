import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import planetsMongo from "./planets.mongo.js";

export const getHabitablePlanets = async () => {
  return await planetsMongo.find({}, { __v: 0, _id: 0 });
};

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
export const loadPlanets = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("kepler_data.csv")
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
      })
      .on("end", async () => {
        const planetsCount = (await getHabitablePlanets()).length;
        console.log(`${planetsCount} habitable planets found!`);
        resolve();
      });
  });
};

const savePlanets = async (data) => {
  try {
    await planetsMongo.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      { upsert: true }
    );
  } catch (error) {
    console.log("Could not save planet", err);
  }
};
//path.join(__dirname, "..", "..", "data", "kepler_data.csv")
