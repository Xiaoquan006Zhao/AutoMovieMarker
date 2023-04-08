const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = "INSERT IGNORE INTO emotions(emotion_name) Values (?)";
  const { emotion_name } = JSON.parse(event.body);

  const response = await template.templatedQuery(queryString, [emotion_name]);

  return template.templateSend(response);
};
