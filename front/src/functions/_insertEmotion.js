const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = "INSERT IGNORE INTO emotions(emotion_name) Values (?)";
  const { value } = JSON.parse(event.body);

  const response = await template.templatedQuery(queryString, [value]);

  return template.templateSend(response);
};
