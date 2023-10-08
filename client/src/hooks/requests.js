async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch("http://localhost:8000/planets");
  return response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch("http://localhost:8000/launches");
  console.log("==========> getting launches");
  const launches = await response.json();
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch("http://localhost:8000/launches", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`http://localhost:8000/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
