const template = require("./utils/templateFunction");

// Endpoint: POST /clips/:clip_id/emotions/:emotion_id
exports.handler = async (event, context) => {
  const { clip_id, emotion_id } = event.queryStringParameters;

  const query = "INSERT INTO clip_emotions (clip_id, emotion_id) VALUES (?, ?)";
  const data = await template.templatedQuery(event, query, [
    clip_id,
    emotion_id,
  ]);

  return template.templateSend(data);
};
