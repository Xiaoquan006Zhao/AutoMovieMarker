const template = require("./utils/templateFunction");

// Endpoint: GET /clips/:clip_id/emotions
// Returns all emotions associated with a clip
exports.handler = async (event, context) => {
  const { clip_id } = event.queryStringParameters;
  const queryString = `SELECT emotions.emotion_name, emotions.emotion_id 
    FROM emotions 
    JOIN clip_emotions ON emotions.emotion_id = clip_emotions.emotion_id 
    WHERE clip_emotions.clip_id = ?`;

  const response = await template.templatedQuery(queryString, [clip_id]);
  return template.templateSend(response);
};
