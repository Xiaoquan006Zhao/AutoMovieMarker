const template = require("./utils/templateFunction");

// This endpoint returns the details of the clip with the specified clip ID
// Endpoint: GET /clips/:clip_id
exports.handler = async (event, context) => {
  const { clip_id } = event.queryStringParameters;

  const query = `SELECT clips.clip_id, movies.movie_name, clips.timecode, clips.description, 
  clips.image_url, emotions.emotion_id, emotions.emotion_name
  FROM clips
  JOIN movies ON clips.movie_id = movies.movie_id
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id
  WHERE clips.clip_id = ?`;

  const response = await template.templatedQuery(event, query, [clip_id]);

  return template.templateSend(response, ["clip_id", "emotion_id"]);
};
