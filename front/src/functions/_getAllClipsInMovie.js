const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const { movie_id } = event.queryStringParameters;
  const queryString = `SELECT clips.clip_id, clips.timecode, clips.description, emotions.emotion_name, emotions.emotion_id 
  FROM clips 
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  WHERE clips.movie_id = ?`;

  const response = await template.templatedQuery(event, queryString, [
    movie_id,
  ]);
  return template.templateSend(response);
};
