const template = require("./utils/templateFunction");

// Endpoint: DELETE /clips/:clip_id
exports.handler = async (event, context) => {
  const { clip_id } = event.queryStringParameters;

  // Delete clip emotions
  const queryDeleteClipEmotion = "DELETE FROM clip_emotions WHERE clip_id = ?";
  await template.templatedQuery(event, queryDeleteClipEmotion, [clip_id]);

  // Delete clip
  const queryDeleteClip = "DELETE from clips where clip_id = ?";
  const data = await template.templatedQuery(event, queryDeleteClip, [clip_id]);

  return template.templateSend(data);
};
