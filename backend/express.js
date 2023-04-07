const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const EMOTION = require("./emotions");
const CLIP = require("./clips");
const MOVIE = require("./movies");
const app = express();
const port = 8080;

// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "movies",
//   charset: "utf8mb4",
//   collation: "utf8mb4_general_ci",
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to MySQL database");
// });

require("dotenv").config();
const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log("Connected to PlanetScale!");

app.use(
  function (req, res, next) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
  },
  cors(),
  bodyParser.json()
);

const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";
function handleRequest(method, endpoint, callback) {
  app[method.toLowerCase()](endpoint, (req, res) => {
    callback(connection, req, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(result);
    });
  });
}

handleRequest(POST, "/emotions", EMOTION.insertEmotion);
handleRequest(GET, "/emotions", EMOTION.allEmotions);
handleRequest(PUT, "/emotions-name/:emotion_id", EMOTION.updateEmotionName);
handleRequest(
  PUT,
  "/emotions-category/:emotion_id",
  EMOTION.updateEmotionCategory
);

handleRequest(DELETE, "/emotions/:emotion_id", EMOTION.deleteEmotion);
handleRequest(GET, "/emotions-clip/:clip_id", CLIP.allEmotionsInClip);
handleRequest(GET, "/emotions/:emotion_id", EMOTION.getEmotionById);

handleRequest(POST, "/movies", MOVIE.insertMovie);
handleRequest(GET, "/movies/:movie_id", MOVIE.getMovieById);
handleRequest(GET, "/movies", MOVIE.allMovies);
handleRequest(PUT, "/movies/:movie_id", MOVIE.updateMovie);
handleRequest(DELETE, "/movies/:movie_id", MOVIE.deleteMovie);

handleRequest(GET, "/clip/:clip_id", CLIP.getClipDetail);
handleRequest(POST, "/clips/:movie_id", CLIP.insertClip);
handleRequest(GET, "/clips/:clip_id/field/:field", CLIP.getClipField);
handleRequest(PUT, "/clips/:clip_id", CLIP.updateClipField);
handleRequest(DELETE, "/clips/:clip_id", CLIP.deleteClip);
handleRequest(GET, "/clips/:movie_id/:emotion_id", CLIP.allClipsMatch);
handleRequest(
  GET,
  "/movies/:movie_id/clips/emotions",
  CLIP.allClipsInMovieWithEmotions
);
handleRequest(GET, "/movies/:movie_id/clips", CLIP.allClipsInMovie);
handleRequest(
  POST,
  "/clips/:clip_id/emotions/:emotion_id",
  CLIP.addEmotionToClip
);
handleRequest(
  DELETE,
  "/clips/:clip_id/emotions/:emotion_id",
  CLIP.removeEmotionFromClip
);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
