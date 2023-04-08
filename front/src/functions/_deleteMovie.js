const template = require("./utils/templateFunction");

// Serverless function that deletes a movie and related data from the database.
exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;

  // Delete related clip_emotions records.
  const queryDeleteClipEmotion =
    "DELETE FROM clip_emotions WHERE clip_id IN (SELECT clip_id FROM clips WHERE movie_id = ?)";
  await template.templatedQuery(queryDeleteClipEmotion, [movie_id]);

  // Delete clips records.
  const queryDeleteClips = "DELETE from clips WHERE movie_id = ?";
  await template.templatedQuery(queryDeleteClips, [movie_id]);

  // Delete movie record.
  const queryDeleteMovie = "DELETE from movies WHERE movie_id = ?";
  const data = await template.templatedQuery(queryDeleteMovie, [movie_id]);

  return template.templateSend(data);
};
