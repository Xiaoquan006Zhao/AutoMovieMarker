const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const { clip_id, field } = event.queryStringParameters;
  const { value } = JSON.parse(event.body);

  const query = `UPDATE clips SET \`${field}\` = ? WHERE clip_id = ?`;
  const response = await template.templatedQuery(query, [value, clip_id]);

  return template.templateSend(response);
};
