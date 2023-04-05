import { baseurl } from "./config.js";
import * as utils from "./utils.js";

async function templateFetch(query, method) {
  const response = await fetch(`${baseurl}${query}`, {
    method: method,
  });

  const data = await response.json();

  return data;
}

export async function deleteClip(clipId) {
  return await templateFetch(`/clips/${clipId}`, "DELETE");
}

export async function insertClip(movieId) {
  return await templateFetch(`/clips/${movieId}`, "POST");
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

export async function insertEmotion(emotionName) {
  const response = await fetch(`${baseurl}/emotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emotion_name: emotionName }),
  });

  const data = await response.json();

  return data;
}

export async function deleteEmotion(emotionId) {
  return await templateFetch(`/emotions/${emotionId}`, "DELETE");
}

export async function updateEmotion(emotionId, value) {
  const response = await fetch(`${baseurl}/emotions/${emotionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emotion_name: value,
    }),
  });

  const data = await response.json();

  return data;
}

// Given a emotion_id, retrive emotion_name
export async function getEmotionNameFromDB(emotion_id) {
  return await templateFetch(`/emotions/${emotion_id}`, "GET");
}

// Given a emotion_id, retrive emotion_name
export async function getAllMovieIds() {
  return await templateFetch(`/movies`, "GET");
}

export async function updateMovieName(movieId, value) {
  const response = await fetch(`${baseurl}/movies/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie_name: value,
    }),
  });

  const data = await response.json();

  return data;
}
