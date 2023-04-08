const template = require("./utils/templateFunction");

// This endpoint deletes the emotion with the specified emotion ID
// Endpoint: DELETE /emotions/:emotion_id
exports.handler = async (event, context) => {
  const { emotion_id } = event.queryStringParameters;

  const queryDeleteClipEmotion =
    "DELETE from clip_emotions WHERE emotion_id = ?";
  await template.templatedQuery(queryDeleteClipEmotion, [emotion_id]);

  const queryDeleteEmotion = "DELETE from emotions WHERE emotion_id = ?";
  const response = await template.templatedQuery(queryDeleteEmotion, [
    emotion_id,
  ]);

  return template.templateSend(response);
};
