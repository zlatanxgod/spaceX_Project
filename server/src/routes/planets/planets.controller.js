import { getHabitablePlanets } from "../../models/planets.model.js";
const httpGetAllPlanets = async (req, res) => {
  console.log("=====>");
  return res.status(200).json(await getHabitablePlanets());
};

export default httpGetAllPlanets;
