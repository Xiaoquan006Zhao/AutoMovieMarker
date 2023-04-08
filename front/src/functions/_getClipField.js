const template = require("./utils/templateFunction");

// This endpoint retrieves the value of a specific field for the specified clip
// Endpoint: GET /clips/:clip_id/:field
exports.handler = async (event, context) => {
  const { clip_id, field } = event.queryStringParameters;

  const query = `SELECT ${field} FROM clips WHERE clip_id = ?`;
  const response = await template.templatedQuery(query, [clip_id]);

  return template.templateSend(response, template.stripMetaDataAndToJson);
};
