import { baseurl } from "./config.js";
import * as utils from "./utils.js";
import { accessToken } from "../auth/clerk.js";

async function templateFetch(query, method, body) {
  const response = await fetch(`${baseurl}${query}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data;
}

export async function getNewAccessToken(user_id, currentTime) {
  return await templateFetch(`/__generateJWT`, "POST", {
    user_id: user_id,
    currentTime: currentTime,
  });
}

export async function deleteClip(clip_id) {
  return await templateFetch(`/_deleteClip?clip_id=${clip_id}`, "DELETE");
}

export async function insertClip(movie_id) {
  return await templateFetch(`/_insertClip?movie_id=${movie_id}`, "POST");
}

// Retrive all emotions
export async function getAllEmotions() {
  return await templateFetch("/_getAllEmotions", "GET");
}

// Given a movie_id, retrive all clips in the movie that has emotions.
// used to populate the emotion/movie table
export async function getClipsEmotionInMovie(movie_id) {
  return await templateFetch(
    `/_getAllClipsInMovieWithEmotions?movie_id=${movie_id}`,
    "GET"
  );
}

// Given a movie_id, retrive movie_name
export async function getMovieName(movie_id) {
  return await templateFetch(`/_getMovieName?movie_id=${movie_id}`, "GET");
}

// Given a movie_id and emotion_id, retrive all clips that match
export async function getAllClipsMatch(input) {
  const { movie_id, emotion_id, clicked } = input;

  // get all clips with matching movie_id and emotion_id
  const data = await templateFetch(
    `/_getAllClipsMatch?movie_id=${movie_id}&emotion_id=${emotion_id}`,
    "GET"
  );

  const descriptions = data.map((clip) => clip.description);

  const clipIds = data.map((clip) => clip.clip_id);

  return { descriptions, clipIds, clicked };
}

// Given a clip_id, retrive description, timecode, emotions, image
export async function getClipDetail(input) {
  const { clip_id, clicked } = input;

  const data = await templateFetch(`/_getClipDetail?clip_id=${clip_id}`, "GET");

  const clipsWithEmotion = utils.combineClipEmotion(data);

  return { clipsWithEmotion, clicked };
}

// Given a movieId, retrive all clips in the movie (has or has no emotions)
// used to populate the movie page
export async function getAllClipsInMovie(movie_id) {
  return await templateFetch(
    `/_getAllClipsInMovie?movie_id=${movie_id}`,
    "GET"
  );
}

export async function getAllEmotionInClip(clip_id) {
  return await templateFetch(
    `/_getAllEmotionsInClip?clip_id=${clip_id}`,
    "GET"
  );
}

export async function getEmotionsLinkedAndUnlined(input) {
  const { emotions, emotionIds, clipId, clicked } = input;

  const data = await templateFetch(`/_getAllEmotions`, "GET");

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

export async function updateClipEmotionLink(clip_id, emotion_id, method) {
  if (method === "POST") {
    return await templateFetch(
      `/_addEmotionToClip?clip_id=${clip_id}&emotion_id=${emotion_id}`,
      method
    );
  }
  return await templateFetch(
    `/_removeEmotionFromClip?clip_id=${clip_id}&emotion_id=${emotion_id}`,
    method
  );
}

export async function updateClipField(clip_id, field, value) {
  return await templateFetch(
    `/_updateClipField?clip_id=${clip_id}&field=${field}`,
    "PUT",
    {
      value: value,
    }
  );
}

export async function getClipField(clip_id, field) {
  return await templateFetch(
    `/_getClipField?clip_id=${clip_id}&field=${field}`,
    "GET"
  );
}

export async function insertEmotion(value) {
  return await templateFetch(`/_insertEmotion`, "POST", {
    emotion_name: value,
  });
}

export async function deleteEmotion(emotion_id) {
  return await templateFetch(
    `/_deleteEmotion?emotion_id=${emotion_id}`,
    "DELETE"
  );
}

export async function updateEmotionName(emotion_id, value) {
  return await templateFetch(
    `/_updateEmotionName?emotion_id=${emotion_id}`,
    "PUT",
    { emotion_name: value }
  );
}

export async function updateEmotionCategory(emotion_id, value) {
  return await templateFetch(
    `/_updateEmotionCategory?emotion_id=${emotion_id}`,
    "PUT",
    {
      category: value,
    }
  );
}

// Given a emotion_id, retrive emotion_name
export async function getEmotionName(emotion_id) {
  return await templateFetch(
    `/_getEmotionName?emotion_id=${emotion_id}`,
    "GET"
  );
}

// Given a emotion_id, retrive emotion_name
export async function getAllMovieIds() {
  return await templateFetch(`/_getAllMovieIds`, "GET");
}

export async function updateMovieName(movie_id, value) {
  return await templateFetch(`/_updateMovieName?movie_id=${movie_id}`, "PUT", {
    movie_name: value,
  });
}
