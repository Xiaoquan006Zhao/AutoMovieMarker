const template = require("./utils/templateFunction");

// Serverless function that retrieves a specific movie by its ID from the database.
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;
  const queryString = "SELECT movie_name from movies where movie_id = ?";
  const data = await template.templatedQuery(event, queryString, [movie_id]);
  return template.templateSend(data, null, template.stripMetaDataAndToJson);
};
