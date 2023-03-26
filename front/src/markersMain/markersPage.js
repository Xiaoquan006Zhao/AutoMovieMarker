import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";
import {
  handleOverlay,
  createEmotionEmbed,
  createOverlayEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

import { handleMovieOverlay, updateMovie } from "./movieOverlay.js";
import { handleClipOverlay } from "./clipDetailsOverlay.js";

const tableHeaderRow = document.querySelector("#table-header-row");
const tableBody = document.querySelector("tbody");
const tableHead = document.querySelector("thead");

let emotions = [];
let emotionsId = [];

// helper method to create "th" element
function createHeaderColumns(headers) {
  headers.forEach((element) => {
    const column = document.createElement("th");
    column.appendChild(document.createTextNode(element));
    tableHeaderRow.appendChild(column);
  });
}

async function createEmotionHeader() {
  const records = await DB.getEmotionsFromDB();

  emotions = records.map((record) => {
    return record.emotion_name;
  });

  emotionsId = records.map((record) => {
    return record.emotion_id;
  });

  emotions.unshift(" ");
  emotionsId.unshift(" ");
  createHeaderColumns(emotions);
}

// helper method to populate the row for each emotion based on movie clips
function createRow(category, tr, emotionId) {
  if (category.length !== 0) {
    const td = document.createElement("td");
    td.setAttribute("id", emotionId);
    td.classList.add("dropDown-enable");

    const count = document.createElement("span");
    count.classList.add("count");
    count.classList.add("bg-dark");
    count.appendChild(document.createTextNode(category.length));

    td.appendChild(count);
    td.appendChild(document.createTextNode(category[0].description));

    tr.appendChild(td);
  } else {
    const td = document.createElement("td");
    tr.appendChild(td);
  }
}

export async function createMovieRow(movieId) {
  const clipsCategory = [];

  emotions.forEach((emotion) => {
    clipsCategory.push([]);
  });

  const tr = document.createElement("tr");
  tr.setAttribute("id", movieId);
  const clips = await DB.getClipsEmotionInMovieFromDB(movieId);

  clips.forEach((clip) => {
    const emotion = clip.emotion_name;
    const index = emotions.indexOf(emotion);
    clipsCategory[index].push(clip);
  });

  clipsCategory.forEach((category, index) => {
    createRow(category, tr, emotionsId[index]);
  });

  const movieTd = tr.firstChild;
  movieTd.classList.add("movie-title");
  const movieName = await DB.getMovieNameFromDB(movieId);
  movieTd.appendChild(document.createTextNode(movieName[0].movie_name));

  return tr;
}

// --------------------------------------------------------------- Main page ends

function getMovieIdAndEmotionId(clicked) {
  // becasue the clicked item is a td
  // the tr.id is movieId
  return { movieId: clicked.parentElement.id, emotionId: clicked.id, clicked };
}

function createOverlayClipDescriptions(x, y, data) {
  const { descriptions, clipIds, clicked } = data;

  const divEventEnable = createOverlaySection(
    updateMovie,
    clicked.parentElement,
    x,
    y
  );

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");

  descriptions.forEach((d, index) => {
    const newdivWrap = createOverlayEmbed(d);

    const toolTipText = document.createElement("span");
    toolTipText.appendChild(document.createTextNode(d));
    toolTipText.classList.add("tooltiptext");

    newdivWrap.appendChild(toolTipText);
    newdivWrap.classList.add("tooltip");
    newdivWrap.id = clipIds[index];

    divBox.appendChild(newdivWrap);
  });

  divBox.addEventListener("click", handleClipOverlay);
  divBox.classList.add("dropDown-enable");

  divEventEnable.appendChild(divBox);
}

async function handleOverlayBody(e) {
  if (e.target.classList.contains("movie-title")) {
    const movieId = e.target.parentElement.id;
    // passing the entire row as update reference
    handleMovieOverlay(movieId, e.target.parentElement);
  } else {
    handleOverlay(
      e,
      getMovieIdAndEmotionId,
      DB.getClipsMatchFromDB,
      createOverlayClipDescriptions
    );
  }
}

async function init() {
  await createEmotionHeader();

  tableBody.appendChild(await createMovieRow(1));
  tableBody.appendChild(await createMovieRow(2));
}

tableBody.addEventListener("click", handleOverlayBody);
// tableHead.addEventListener("click", hanleOverlayHead);
init();
