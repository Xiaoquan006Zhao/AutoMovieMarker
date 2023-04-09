const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = `SELECT movies.movie_name, movies.movie_id, 
  clips.clip_id, clips.timecode, clips.description, 
  emotions.emotion_name, emotions.emotion_id
  FROM clips 
  INNER JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  INNER JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  INNER JOIN movies ON clips.movie_id = movies.movie_id
  WHERE movies.movie_id IN (SELECT movie_id FROM movies);`;

  const response = await template.templatedQuery(event, queryString);
  return template.templateSend(response);
};
