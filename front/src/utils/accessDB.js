import { baseurl } from "./config.js";
import * as utils from "./utils.js";

async function templateFetch(query, method) {
  const response = await fetch(`${baseurl}${query}`, {
    method: method,
  });

  const data = await response.json();

  return data;
}

// Retrive all emotions
export async function getEmotionsFromDB() {
  return await templateFetch("/emotions", "GET");
}

// Given a movie_id, retrive all clips in the movie that has emotions.
// used to populate the emotion/movie table
export async function getClipsEmotionInMovieFromDB(movieId) {
  return await templateFetch(`/movies/${movieId}/clips/emotions`, "GET");
}

// Given a movie_id, retrive movie_name
export async function getMovieNameFromDB(movieId) {
  return await templateFetch(`/movies/${movieId}`, "GET");
}

// Given a movie_id and emotion_id, retrive all clips that match
export async function getClipsMatchFromDB(input) {
  const { movieId, emotionId, clicked } = input;

  // get all clips with matching movie_id and emotion_id
  const data = await templateFetch(`/clips/${movieId}/${emotionId}`, "GET");

  const descriptions = data.map((clip) => clip.description);

  const clipIds = data.map((clip) => clip.clip_id);

  return { descriptions, clipIds, clicked };
}

// Given a clip_id, retrive description, timecode, emotions, image
export async function getClipDetailFromDB(input) {
  const { clipId, clicked } = input;

  const data = await templateFetch(`/clip/${clipId}`, "GET");

  const clipsWithEmotion = utils.combineClipEmotion(data);

  return { clipsWithEmotion, clicked };
}

// Given a movieId, retrive all clips in the movie (has or has no emotions)
// used to populate the movie page
export async function getClipsInMovieFromDB(movieId) {
  return await templateFetch(`/movies/${movieId}/clips`, "GET");
}

export async function getEmotionInClipFromDB(clipId) {
  return await templateFetch(`/emotions-clip/${clipId}`, "GET");
}

export async function getEmotionsLinkedAndUnlinedFromDB(input) {
  const { emotions, emotionIds, clipId, clicked } = input;

  const data = await templateFetch(`/emotions`, "GET");

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
  return await templateFetch(`/clips/${clipId}/emotions/${emotionId}`, method);
}

export async function updateClipField(clipId, field, value) {
  const response = await fetch(`${baseurl}/clips/${clipId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      field: field,
      value: value,
    }),
  });

  const data = await response.json();

  return data;
}

export async function getClipField(clipId, field) {
  return await templateFetch(`/clips/${clipId}/field/${field}`, "GET");
}
