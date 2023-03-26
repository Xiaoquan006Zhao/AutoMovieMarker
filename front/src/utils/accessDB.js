import { baseurl } from "./config.js";
import * as utils from "./utils.js";

// Retrive all emotions
export async function getEmotionsFromDB() {
  const response = await fetch(`${baseurl}/emotions`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

// Given a movie_id, retrive all clips in the movie that has emotions.
// used to populate the emotion/movie table
export async function getClipsEmotionInMovieFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}/clips/emotions`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

// Given a movie_id, retrive movie_name
export async function getMovieNameFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}`, {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

// Given a movie_id and emotion_id, retrive all clips that match
export async function getClipsMatchFromDB(input) {
  const { movieId, emotionId, clicked } = input;
  // get all clips with matching movie_id and emotion_id
  const response = await fetch(`${baseurl}/clips/${movieId}/${emotionId}`, {
    method: "GET",
  });
  const data = await response.json();

  const descriptions = data.map((clip) => {
    return clip.description;
  });

  const clipIds = data.map((clip) => {
    return clip.clip_id;
  });

  return { descriptions, clipIds, clicked };
}

// Given a clip_id, retrive description, timecode, emotions, image
export async function getClipDetailFromDB(input) {
  const { clipId, clicked } = input;

  const response = await fetch(`${baseurl}/clip/${clipId}`, {
    method: "GET",
  });

  const data = await response.json();

  const clipsWithEmotion = utils.combineClipEmotion(data);

  return { clipsWithEmotion, clicked };
}

// Given a movieId, retrive all clips in the movie (has or has no emotions)
// used to populate the movie page
export async function getClipsInMovieFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}/clips`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

export async function getEmotionInClipFromDB(clipId) {
  const response = await fetch(`${baseurl}/emotions-clip/${clipId}`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

export async function getEmotionsLinkedAndUnlinedFromDB(input) {
  const { emotions, emotionIds, clipId, clicked } = input;

  const response = await fetch(`${baseurl}/emotions`, {
    method: "GET",
  });
  const data = await response.json();

  const unlinkedEmotions = data
    .filter((emotion) => {
      return !emotions.includes(emotion.emotion_name);
    })
    .map((emotion) => emotion.emotion_name);

  const unlinkedEmotionIds = data
    .filter((emotion) => {
      return !emotions.includes(emotion.emotion_name);
    })
    .map((emotion) => emotion.emotion_id);

  return {
    emotions,
    emotionIds,
    unlinkedEmotions,
    unlinkedEmotionIds,
    clipId,
    clicked,
  };
}

export async function updateClipEmotionLink(clipId, emotionId, method) {
  await fetch(`${baseurl}/clips/${clipId}/emotions/${emotionId}`, {
    method: method,
  });
}
