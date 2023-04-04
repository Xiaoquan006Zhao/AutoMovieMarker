const { formatResults, templateQuery } = require("./utils");

const emotionProperties = ["emotion_id", "emotion_name"];

function getEmotionById(connection, req, callback) {
  const { emotion_id } = req.params;
  const query = "SELECT emotion_name from emotions where emotion_id = ?";
  templateQuery(connection, query, [emotion_id], callback);
}

function allEmotions(connection, req, callback) {
  const query = "SELECT * from emotions";
  templateQuery(connection, query, null, callback);
}

function insertEmotion(connection, req, callback) {
  const { emotion_name } = req.body;
  const query = "INSERT IGNORE INTO emotions(emotion_name) Values (?)";
  templateQuery(connection, query, [emotion_name], callback);
}

function updateEmotion(connection, req, callback) {
  const { emotion_id } = req.params;
  const { emotion_name } = req.body;
  const query = "UPDATE emotions SET emotion_name = ? WHERE emotion_id = ?";
  templateQuery(connection, query, [emotion_name, emotion_id], callback);
}

function deleteEmotion(connection, req, callback) {
  const { emotion_id } = req.params;
  const queryDeleteClipEmotion =
    "DELETE from clip_emotions WHERE emotion_id = ?";
  templateQuery(
    connection,
    queryDeleteClipEmotion,
    [emotion_id],
    (error, results) => {
      if (error) callback(error);
    }
  );

  const queryDeleteEmotion = "DELETE from emotions WHERE emotion_id = ?";
  templateQuery(connection, queryDeleteEmotion, [emotion_id], callback);
}

module.exports = {
  insertEmotion,
  updateEmotion,
  allEmotions,
  deleteEmotion,
  getEmotionById,
};
