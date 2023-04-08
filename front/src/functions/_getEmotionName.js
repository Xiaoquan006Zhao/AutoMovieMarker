const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = "SELECT emotion_name from emotions where emotion_id = ?";
  const { emotion_id } = event.queryStringParameters;

  const response = await template.templatedQuery(queryString, [emotion_id]);

  return template.templateSend(response, template.stripMetaDataAndToJson);
};
