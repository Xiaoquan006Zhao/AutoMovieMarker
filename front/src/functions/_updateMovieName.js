const template = require("./utils/templateFunction");

// Serverless function that updates an existing movie in the database.
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;
  const { movie_name } = JSON.parse(event.body);
  const queryString = "UPDATE movies SET movie_name = ? WHERE movie_id = ?";
  const data = await template.templatedQuery(queryString, [
    movie_name,
    movie_id,
  ]);
  return template.templateSend(data);
};
