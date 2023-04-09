const template = require("./utils/templateFunction");

// This endpoint inserts a new clip for the specified movie
// Endpoint: POST /movies/:movie_id/clips
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;

  const queryInsertClip = `INSERT INTO clips (movie_id, image_url) VALUES (?, ?)`;
  const response = await template.templatedQuery(event, queryInsertClip, [
    movie_id,
    "no image",
  ]);

  return template.templateSend(response);
};
