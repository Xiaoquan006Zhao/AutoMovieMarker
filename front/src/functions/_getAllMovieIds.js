const template = require("./utils/templateFunction");

// This serverless function retrieves all movie IDs from the database.
exports.handler = async (event, context) => {
  const queryString = "SELECT movie_id from movies ORDER BY movie_name ASC";
  const data = await template.templatedQuery(event, queryString);
  return template.templateSend(data);
};
