const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  getClipField,
  getClipDetail,
  insertClips,
  updateClipField,
  deleteClip,
  allClipsInMovie,
  allClipsMatch,
  allClipsInMovieWithEmotions,
  addEmotionToClip,
  removeEmotionFromClip,
  allEmotionsInClip,
} = require("./clips");
const {
  insertEmotion,
  updateEmotion,
  deleteEmotion,
  allEmotions,
} = require("./emotions");
const {
  insertMovie,
  updateMovie,
  deleteMovie,
  allMovies,
  getMovieById,
} = require("./movies");

const app = express();
const port = 8080;

app.use(
  function (req, res, next) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
  },
  cors(),
  bodyParser.json()
);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "movies",
  charset: "utf8mb4",
  collation: "utf8mb4_general_ci",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Endpoints for emotions
app.post("/emotions", (req, res) => {
  const { name } = req.body;
  insertEmotion(connection, name, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/emotions", (req, res) => {
  allEmotions(connection, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.put("/emotions/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  updateEmotion(connection, id, name, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.delete("/emotions/:id", (req, res) => {
  const { id } = req.params;
  deleteEmotion(connection, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/emotions-clip/:clip_id", (req, res) => {
  const { clip_id } = req.params;
  allEmotionsInClip(connection, clip_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// Endpoints for movies
app.post("/movies", (req, res) => {
  const { name } = req.body;
  insertMovie(connection, name, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  getMovieById(connection, id, (error, result) => {
    if (error) {
      res.status(500).send("Internal server error");
    }
    res.json(result);
  });
});

app.get("/movies", (req, res) => {
  allMovies(connection, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.put("/movies/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  updateMovie(connection, id, name, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  deleteMovie(connection, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// Endpoints for clips

app.get("/clip/:id", (req, res) => {
  const { id } = req.params;

  getClipDetail(connection, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.post("/clips", (req, res) => {
  const { movieName, clips } = req.body;
  insertClips(connection, movieName, clips, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/clips/:id/field/:field", (req, res) => {
  const { id, field } = req.params;
  getClipField(connection, id, field, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.put("/clips/:id", (req, res) => {
  const { id } = req.params;
  const { field, value } = req.body;
  updateClipField(connection, id, field, value, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.delete("/clips/:id", (req, res) => {
  const { id } = req.params;
  deleteClip(connection, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.get("/clips/:movie_id/:emotion_id", (req, res) => {
  const { movie_id, emotion_id } = req.params;

  allClipsMatch(connection, movie_id, emotion_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json(result);
  });
});

// Endpoint to retrieve all clips in a movie with emotions
app.get("/movies/:movie_id/clips/emotions", (req, res) => {
  const movie_id = req.params.movie_id;
  allClipsInMovieWithEmotions(connection, movie_id, (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// Endpoint for retrieving all clips for a given movie ID
app.get("/movies/:movie_id/clips", (req, res) => {
  const movieId = req.params.movie_id;
  allClipsInMovie(connection, movieId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// Endpoint for adding an emotion to a clip
app.post("/clips/:clip_id/emotions/:emotion_id", (req, res) => {
  const clipId = req.params.clip_id;
  const emotionId = req.params.emotion_id;
  addEmotionToClip(connection, clipId, emotionId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// Endpoint for removing an emotion from a clip
app.delete("/clips/:clip_id/emotions/:emotion_id", (req, res) => {
  const clipId = req.params.clip_id;
  const emotionId = req.params.emotion_id;
  removeEmotionFromClip(connection, clipId, emotionId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
