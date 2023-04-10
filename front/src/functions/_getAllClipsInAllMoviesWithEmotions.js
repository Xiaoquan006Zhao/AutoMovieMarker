const template = require("./utils/templateFunction");

exports.handler = async (event, context) => {
  const queryString = `SELECT movies.movie_name, movies.movie_id, 
  clips.description, 
  emotions.emotion_name, emotions.emotion_id
  FROM movies
  LEFT JOIN clips ON clips.movie_id = movies.movie_id
  LEFT JOIN clip_emotions ON clips.clip_id = clip_emotions.clip_id 
  LEFT JOIN emotions ON clip_emotions.emotion_id = emotions.emotion_id 
  WHERE movies.movie_id IN (SELECT movie_id FROM movies)`;

  const response = await template.templatedQuery(event, queryString);
  return template.templateSend(response, ["movie_id", "emotion_id"]);
};
