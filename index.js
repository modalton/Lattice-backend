const express = require("express");
const app = express();
const fetch = require("node-fetch");
const port = process.env.PORT || 3030;

const apiKey = process.env.API_KEY;
const baseMovieUrl = "https://api.themoviedb.org/3";

const authFetch = (url, options) =>
  fetch(
    `${url}${url.includes("?") ? '&' : '?'}api_key=${apiKey}`,
    options
  );

app.get("/movie/popular", async (_, res) => {
  try {
    const apiResp = await authFetch(`${baseMovieUrl}/movie/popular`);
    if (apiResp.ok) {
      const { results } = await apiResp.json();
      return res.send(results);
    } else {
      return res.status(500).send({ error: "Non-success code recieved from MovieDb" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Error" });
  }
});

app.get("/movie/:movieId", async ({ params: { movieId } }, res) => {
  try {
    if (Number.isNaN(Number(movieId))) {
      return res.status(400).send({ error: "Invalid MovieId" });
    }
    const apiResp = await authFetch(`${baseMovieUrl}/movie/${movieId}`);
    if (apiResp.ok) {
      return res.send(await apiResp.json());
    } else {
      return res.status(500).send({ error: "Non-success code recieved from MovieDb" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Error" });
  }
});

app.get("/search/movie", async ({ query: { query } }, res) => {
  try {
    if (typeof query !== "string") {
      return res.status(400).send({ error: "Must include query" });
    }
    const apiResp = await authFetch(
      `${baseMovieUrl}/search/movie?query=${query}`
    );
    if (apiResp.ok) {
      const { results } = await apiResp.json();
      return res.send(results);
    } else {
      return res.status(500).send({ error: "Non-success code recieved from MovieDb" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Error" });
  }
});

app.get("/*", (_, res) => res.status(404).send({ error: "Unknown Endpoint" }));

app.listen(port, () => console.log(`Listening on port ${port}`));
