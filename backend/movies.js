const { formatResults, templateQuery } = require("./utils");

const movieProperties = ["movie_id", "movie_name"];

function allMovies(connection, req, callback) {
  const query = "SELECT * from movies";
  templateQuery(connection, query, null, callback);
}

function getMovieById(connection, req, callback) {
  const { movie_id } = req.params;
  const query = "SELECT movie_name from movies where movie_id = ?";
  templateQuery(connection, query, [movie_id], callback);
}

function insertMovie(connection, req, callback) {
  const { movie_name } = req.body;
  const query = "INSERT IGNORE INTO movies(movie_name) Values (?)";
  templateQuery(connection, query, [movie_name], callback);
}

function updateMovie(connection, req, callback) {
  const { movie_id } = req.params;
  const { movie_name } = req.body;

  const query = "UPDATE movies SET movie_name = ? WHERE movie_id = ?";
  templateQuery(connection, query, [movie_name, movie_id], callback);
}

function deleteMovie(connection, req, callback) {
  const { movie_id } = req.params;

  const queryDeleteClipEmotion =
    "DELETE FROM clip_emotions WHERE clip_id IN (SELECT clip_id FROM clips WHERE movie_id = ?)";
  templateQuery(
    connection,
    queryDeleteClipEmotion,
    [movie_id],
    (error, results) => {
      if (error) callback(error);
    }
  );

  const queryDeleteClips = "DELETE from clips WHERE movie_id = ?";
  templateQuery(connection, queryDeleteClips, [movie_id], (error, results) => {
    if (error) callback(error);
  });

  const queryDeleteMovie = "DELETE from movies WHERE movie_id = ?";
  templateQuery(connection, queryDeleteMovie, [movie_id], callback);
}

module.exports = {
  insertMovie,
  updateMovie,
  allMovies,
  deleteMovie,
  getMovieById,
};
