import launchesMongo from "./launches.mongo.js";
import planetsMongo from "./planets.mongo.js";
import axios from "axios";

const DEFAULT_FLIGHT_NUMBER = 100;

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesMongo.findOne().sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
};

export const getLaunchList = async (skip, limit) => {
  console.log("In here");
  return await launchesMongo
    .find(
      {},
      {
        __id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

export const savelaunch = async (launch) => {
  await launchesMongo.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },

    launch,

    {
      upsert: true,
    }
  );
};

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const findLaunch = async (filter) => {
  return await launchesMongo.findOne(filter);
};

const populateLaunchData = async () => {
  console.log("Downloading.....");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading data poplulateLaunchData");
    throw new Error("Error");
  }

  const launchDocs = response.data.docs;
  console.log(launchDocs.length);

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => {
      return payload.customers;
    });
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    savelaunch(launch);
    //console.log(launch.mission);
  }
};

export const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunchData();
  }
};

export const scheduleNewLaunch = async (launch) => {
  const planet = await planetsMongo.findOne({
    keplerName: launch.target,
  });
  //console.log("=====>planet", planet);

  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customers: ["abc"],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber,
  });

  await savelaunch(launch);
};

export const getId = (id) => {
  console.log("======>id", id);
};

export const existsLaunchWithId = async (launchId) => {
  return await findLaunch({ flightNumber: launchId });
};

export const abort = async (id) => {
  const aborted = await launchesMongo.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  // console.log("====>", aborted.body);
  // console.log(aborted.modifiedCount);

  return aborted.modifiedCount === 1;
};
