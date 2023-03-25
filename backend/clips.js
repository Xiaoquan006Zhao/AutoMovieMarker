const { formatResults } = require("./utils");

const clipProperties = ["clip_id", "timecode", "description", "image_url"];

function insertClips(connection, movieName, clips, callback) {
  connection.query(
    "SELECT movie_id FROM movies WHERE movie_name = ?",
    [movieName],
    (error, results, fields) => {
      if (error) return callback(error);

      if (results.length === 0) {
        return callback(`Movie "${movieName}" not found in the database`);
      }

      const movieId = results[0].movie_id;

      const values = clips
        .map(
          (clip) =>
            `('${clip.timecode}', '${clip.description}', '${clip.image_url}', ${movieId})`
        )
        .join(",");

      connection.query(
        `INSERT INTO clips (timecode, description, image_url, movie_id) VALUES ${values}`,
        (error, results, fields) => {
          if (error) return callback(error);
        }
      );
    }
  );
}

function updateClipField(connection, field, clip_id, updated, callback) {
  connection.query(
    "UPDATE clips SET ? = ? WHERE clip_id = ?",
    [field, updated, clip_id],
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

function deleteClip(connection, clip_id, callback) {
  connection.query(
    "DELETE FROM clip_emotions WHERE clip_id = ?",
    clip_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );

  connection.query(
    "DELETE from clips where clip_id = ?",
    clip_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

function addEmotionToClip(connection, clip_id, emotion_id, callback) {
  connection.query(
    "INSERT INTO clip_emotions (clip_id, emotion_id) VALUES (?, ?)",
    [clip_id, emotion_id],
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

function removeEmotionFromClip(connection, clip_id, emotion_id, callback) {
  connection.query(
    "DELETE from clip_emotions where clip_id = ? AND emotion_id = ?",
    [clip_id, emotion_id],
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

function allClipsMatch(connection, movie_id, emotion_id, callback) {
  connection.query(
    "SELECT clips.clip_id, description, image_url, timecode FROM clips JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id WHERE movie_id = ? AND emotion_id = ?",
    [movie_id, emotion_id],
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

function allClipsInMovie(connection, movie_id, callback) {
  connection.query(
    "SELECT clips.clip_id, clips.timecode, clips.description, emotions.emotion_name, emotions.emotion_id FROM clips LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id WHERE clips.movie_id = ?",
    movie_id,
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

function allClipsInMovieWithEmotions(connection, movie_id, callback) {
  connection.query(
    "SELECT clips.clip_id, clips.timecode, clips.description, emotions.emotion_name, emotions.emotion_id FROM clips INNER JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id INNER JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id WHERE clips.movie_id = ?",
    movie_id,
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
}

module.exports = {
  insertClips,
  addEmotionToClip,
  updateClipField,
  allClipsInMovie,
  removeEmotionFromClip,
  deleteClip,
  allClipsMatch,
  allClipsInMovieWithEmotions,
};
