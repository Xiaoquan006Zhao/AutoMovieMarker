const template = require("./utils/templateFunction");

// Endpoint: GET /movies/:movie_id/emotions/:emotion_id/clips
exports.handler = async (event, context) => {
  const { movie_id, emotion_id } = event.queryStringParameters;

  const query = `SELECT clips.clip_id, description, image_url, timecode 
    FROM clips 
    JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
    WHERE movie_id = ? AND emotion_id = ?`;
  const data = await template.templatedQuery(event, query, [
    movie_id,
    emotion_id,
  ]);

  return template.templateSend(data);
};
