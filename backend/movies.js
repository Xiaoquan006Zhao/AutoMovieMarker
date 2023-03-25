const { formatResults } = require("./utils");

const movieProperties = ["movie_id", "movie_name"];

function allMovies(connection, callback) {
  connection.query("SELECT * from movies", (error, results, fields) => {
    if (error) return callback(error);
    callback(null, results);
  });
}

function getMovieById(connection, movieId, callback) {
  connection.query(
    "SELECT movie_name from movies where movie_id = ?",
    movieId,
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

function insertMovie(connection, movie, callback) {
  connection.query(
    "INSERT IGNORE INTO movies(movie_name) Values (?)",
    movie,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

function updateMovie(connection, new_movie, old_movie, callback) {
  connection.query(
    "UPDATE movies SET movie_name = ? WHERE movie_name = ?",
    [new_movie, old_movie],
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

function deleteMovie(connection, movie_id, callback) {
  connection.query(
    "DELETE FROM clip_emotions WHERE clip_id IN (SELECT clip_id FROM clips WHERE movie_id = ?)",
    movie_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );

  connection.query(
    "DELETE from clips WHERE movie_id = ?",
    movie_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );

  connection.query(
    "DELETE from movies WHERE movie_id = ?",
    movie_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

module.exports = {
  insertMovie,
  updateMovie,
  allMovies,
  deleteMovie,
  getMovieById,
};
