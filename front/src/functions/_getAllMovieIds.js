const template = require("./utils/templateFunction");

// This serverless function retrieves all movie IDs from the database.
exports.handler = async (event, context) => {
  const queryString = "SELECT movie_id from movies";
  const data = await template.templatedQuery(queryString);
  return template.templateSend(data);
};
