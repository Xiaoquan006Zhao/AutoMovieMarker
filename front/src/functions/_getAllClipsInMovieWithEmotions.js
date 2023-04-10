const template = require("./utils/templateFunction");

// Endpoint: GET /movies/:movie_id/clips-with-emotions
// Retrieves all clips in a movie along with their associated emotions.
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;
  const queryString = `SELECT movies.movie_name, movies.movie_id, 
  clips.clip_id, clips.timecode, clips.description, 
  emotions.emotion_name, emotions.emotion_id
  FROM movies
  LEFT JOIN clips ON clips.movie_id = movies.movie_id
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  WHERE movies.movie_id = ?`;

  const response = await template.templatedQuery(event, queryString, [
    movie_id,
  ]);
  return template.templateSend(response);
};
