const template = require("./utils/templateFunction");

// Serverless function that inserts a new movie into the database.
exports.handler = async (event, context) => {
  const { movie_name } = JSON.parse(event.body);
  const queryString = "INSERT IGNORE INTO movies(movie_name) Values (?)";
  const data = await template.templatedQuery(event, queryString, [movie_name]);
  return template.templateSend(data);
};
