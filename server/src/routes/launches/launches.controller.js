import {
  getLaunchList,
  scheduleNewLaunch,
  abort,
  existsLaunchWithId,
} from "../../models/launches.model.js";
import Joi from "joi";
import { getPagination } from "../../../services/query.js";

export const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  console.log(skip, limit);
  console.log("dsfsfsdfsdf");
  return res.status(200).json(await getLaunchList(skip, limit));
};

const schema = Joi.object({
  mission: Joi.string().required(),
  rocket: Joi.string().required(),
  target: Joi.string().required(),
  launchDate: Joi.required(),
});

export const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  const { value, error } = schema.validate(launch);
  if (error) {
    console.log("validation error", error);
    return res.status(422).json({ error: "Invalid Data" });
  }

  launch.launchDate = new Date(launch.launchDate);
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

export const httpAbortLaunch = async (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  if (!(await existsLaunchWithId(id))) {
    return res.status(404).json({
      error: "Invalid flight id",
    });
  }

  const ret = await abort(id);
  res.status(200).json(ret);
};
