const template = require("./utils/templateFunction");

// Endpoint: GET /movies/:movie_id/clips-with-emotions
// Retrieves all clips in a movie along with their associated emotions.
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;
  const queryString = `SELECT clips.clip_id, clips.timecode, clips.description, 
    emotions.emotion_name, emotions.emotion_id 
    FROM clips 
    INNER JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
    INNER JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
    WHERE clips.movie_id = ?`;

  const response = await template.templatedQuery(event, queryString, [
    movie_id,
  ]);
  return template.templateSend(response);
};
