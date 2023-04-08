const template = require("./utils/templateFunction");

// This endpoint updates the category of an emotion with the specified emotion ID
// Endpoint: PUT /emotions/:emotion_id/category
exports.handler = async (event, context) => {
  const { emotion_id } = event.queryStringParameters;
  const { category } = JSON.parse(event.body);

  const queryString = "UPDATE emotions SET category = ? WHERE emotion_id = ?";
  const response = await template.templatedQuery(queryString, [
    category,
    emotion_id,
  ]);

  return template.templateSend(response);
};
