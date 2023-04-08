const template = require("./utils/templateFunction");

// This endpoint updates the name of an emotion with the specified emotion ID
// Endpoint: PUT /emotions/:emotion_id
exports.handler = async (event, context) => {
  const { emotion_id } = event.queryStringParameters;
  const { emotion_name } = JSON.parse(event.body);

  const queryString =
    "UPDATE emotions SET emotion_name = ? WHERE emotion_id = ?";
  const response = await template.templatedQuery(queryString, [
    emotion_name,
    emotion_id,
  ]);

  return template.templateSend(response);
};
