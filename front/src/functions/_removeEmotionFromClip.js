// Endpoint: DELETE /clips/:clip_id/emotions/:emotion_id
const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const { clip_id, emotion_id } = event.queryStringParameters;

  const query =
    "DELETE from clip_emotions where clip_id = ? AND emotion_id = ?";
  const data = await template.templatedQuery(query, [clip_id, emotion_id]);

  return template.templateSend(data);
};
