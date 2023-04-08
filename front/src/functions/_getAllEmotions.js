const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = "SELECT * FROM emotions";
  const data = await template.templatedQuery(queryString);

  return template.templateSend(data);
};
