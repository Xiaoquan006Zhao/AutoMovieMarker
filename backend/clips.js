const { formatResults, templateQuery } = require("./utils");

const clipProperties = ["clip_id", "timecode", "description", "image_url"];

function getClipDetail(connection, req, callback) {
  const { clip_id } = req.params;
  const query = `SELECT clips.clip_id, movies.movie_name, clips.timecode, clips.description, 
  clips.image_url, emotions.emotion_id, emotions.emotion_name
  FROM clips
  JOIN movies ON clips.movie_id = movies.movie_id
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id
  WHERE clips.clip_id = ?`;

  templateQuery(connection, query, [clip_id], callback);
}

function insertClip(connection, req, callback) {
  const { movie_id } = req.params;

  const queryInsertCip = `Insert into clips (movie_id, image_url) values (?, ?)`;

  templateQuery(connection, queryInsertCip, [movie_id, "no image"], callback);
}

function getClipField(connection, req, callback) {
  const { clip_id, field } = req.params;
  const query = `SELECT ${field} FROM clips WHERE clip_id = ?`;
  templateQuery(connection, query, [clip_id], callback);
}

function updateClipField(connection, req, callback) {
  const { clip_id } = req.params;
  const { field, value } = req.body;

  const query = `UPDATE clips SET \`${field}\` = ? WHERE clip_id = ?`;
  templateQuery(connection, query, [value, clip_id], callback);
}

function deleteClip(connection, req, callback) {
  const { clip_id } = req.params;
  const queryDeleteClipEmotion = "DELETE FROM clip_emotions WHERE clip_id = ?";
  templateQuery(
    connection,
    queryDeleteClipEmotion,
    [clip_id],
    (error, results) => {
      if (error) callback(error);
    }
  );

  const queryDeleteClip = "DELETE from clips where clip_id = ?";
  templateQuery(connection, queryDeleteClip, [clip_id], callback);
}

function addEmotionToClip(connection, req, callback) {
  const { clip_id, emotion_id } = req.params;

  const query = "INSERT INTO clip_emotions (clip_id, emotion_id) VALUES (?, ?)";
  templateQuery(connection, query, [clip_id, emotion_id], callback);
}

function removeEmotionFromClip(connection, req, callback) {
  const { clip_id, emotion_id } = req.params;
  const query =
    "DELETE from clip_emotions where clip_id = ? AND emotion_id = ?";
  templateQuery(connection, query, [clip_id, emotion_id], callback);
}

function allClipsMatch(connection, req, callback) {
  const { movie_id, emotion_id } = req.params;
  const query = `SELECT clips.clip_id, description, image_url, timecode 
  FROM clips 
  JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  WHERE movie_id = ? AND emotion_id = ?`;

  templateQuery(connection, query, [movie_id, emotion_id], callback);
}

function allClipsInMovie(connection, req, callback) {
  const { movie_id } = req.params;
  const query = `SELECT clips.clip_id, clips.timecode, clips.description, 
  emotions.emotion_name, emotions.emotion_id 
  FROM clips 
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  WHERE clips.movie_id = ?`;

  templateQuery(connection, query, [movie_id], callback);
}

function allEmotionsInClip(connection, req, callback) {
  const { clip_id } = req.params;
  const query = `SELECT emotions.emotion_name, emotions.emotion_id 
  FROM emotions 
  JOIN clip_emotions ON emotions.emotion_id = clip_emotions.emotion_id 
  WHERE clip_emotions.clip_id = ?`;
  templateQuery(connection, query, [clip_id], callback);
}

function allClipsInMovieWithEmotions(connection, req, callback) {
  const { movie_id } = req.params;
  const query = `SELECT clips.clip_id, clips.timecode, clips.description, 
  emotions.emotion_name, emotions.emotion_id 
  FROM clips 
  INNER JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  INNER JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  WHERE clips.movie_id = ?`;
  templateQuery(connection, query, [movie_id], callback);
}

module.exports = {
  insertClip,
  addEmotionToClip,
  updateClipField,
  allClipsInMovie,
  removeEmotionFromClip,
  deleteClip,
  allClipsMatch,
  allClipsInMovieWithEmotions,
  allEmotionsInClip,
  getClipDetail,
  getClipField,
};
