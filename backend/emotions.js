const { formatResults } = require("./utils");

const emotionProperties = ["emotion_id", "emotion_name"];

function allEmotions(connection, callback) {
  connection.query("SELECT * from emotions", (error, results, fields) => {
    if (error) return callback(error);
    callback(null, results);
  });
}

function insertEmotion(connection, emotion, callback) {
  connection.query(
    "INSERT IGNORE INTO emotions(emotion_name) Values (?)",
    emotion,
    (error, results, fields) => {
      if (error) return callback(error);
      callback(null, results.insertId);
    }
  );
}

function updateEmotion(connection, new_emotion, old_emotion, callback) {
  connection.query(
    "UPDATE emotions SET emotion_name = ? WHERE emotion_name = ?",
    [new_emotion, old_emotion],
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

function deleteEmotion(connection, emotion_id, callback) {
  connection.query(
    "DELETE from clip_emotions WHERE emotion_id = ?",
    emotion_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );

  connection.query(
    "DELETE from emotions WHERE emotion_id = ?",
    emotion_id,
    (error, results, fields) => {
      if (error) return callback(error);
    }
  );
}

module.exports = { insertEmotion, updateEmotion, allEmotions, deleteEmotion };
