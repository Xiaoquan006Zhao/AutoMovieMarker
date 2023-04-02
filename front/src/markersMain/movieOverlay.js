import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

import { updateFieldOverlay } from "./subOverlay.js";
import { createMovieRow, applyFilters } from "./markersPage.js";
import { handleClipOverlay } from "./clipDetailsOverlay.js";

export async function handleMovieOverlay(movieId, clicked) {
  createOverlayMovie(movieId, clicked);
}

export async function updateMovie(updateReference) {
  const tableElement = updateReference.parentElement;
  const newElement = await createMovieRow(updateReference.id);

  const siblingElement = updateReference.nextSibling;
  tableElement.insertBefore(newElement, siblingElement);

  updateReference.remove();
  applyFilters();
}

async function createOverlayMovie(movieId, clicked) {
  const movieName = await DB.getMovieNameFromDB(movieId);

  const divEventEnable = createOverlaySection(updateMovie, clicked);

  const divWindow = document.createElement("div");
  divWindow.id = movieId;
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(movieName[0].movie_name));

  divWindow.appendChild(title);

  const table = await createClipsTable(movieId);
  divWindow.appendChild(table);

  divEventEnable.appendChild(divWindow);
}

function createClipRow(
  clip,
  clipsAttributes,
  clipsTableBody,
  insertBeforeThis
) {
  const BodyTr = document.createElement("tr");
  BodyTr.id = clip.clip_id;

  if (!insertBeforeThis) {
    clipsTableBody.appendChild(BodyTr);
  } else {
    clipsTableBody.insertBefore(BodyTr, insertBeforeThis);
  }

  clipsAttributes.forEach((attribute) => {
    const td = document.createElement("td");
    if (attribute === "emotions") {
      const divEmotions = document.createElement("div");
      createEmotionEmbed(clip, divEmotions);
      td.appendChild(divEmotions);

      BodyTr.appendChild(td);
    } else {
      td.appendChild(document.createTextNode(clip[attribute]));
      td.classList.add("dropDown-text");
      td.classList.add("dropDown-enable");
      BodyTr.appendChild(td);
    }
  });

  BodyTr.addEventListener("mouseenter", (e) => {
    createAddDeleteOpenButton(BodyTr, clickAdd, clickDelete, handleClipOverlay);
  });

  BodyTr.addEventListener("mouseout", (e) => {
    const tr = e.currentTarget;
    const relatedTarget = e.relatedTarget;

    // Check if the relatedTarget is a child of BodyTr
    if (!tr.contains(relatedTarget)) {
      const firstTd = e.currentTarget.firstChild;
      firstTd.removeChild(firstTd.lastChild);
      tr.removeChild(tr.lastChild);
    }
  });
}

async function createClipsTable(movieId) {
  const clipsTable = document.createElement("table");
  const clipsTableHead = document.createElement("thead");
  const clipsTableBody = document.createElement("tbody");

  clipsTable.appendChild(clipsTableHead);
  clipsTable.appendChild(clipsTableBody);

  const headTr = document.createElement("tr");
  clipsTableHead.appendChild(headTr);

  // headers
  const clipsAttributes = ["description", "timecode", "emotions"];

  clipsAttributes.forEach((attribute) => {
    const column = document.createElement("th");
    column.appendChild(document.createTextNode(attribute));
    headTr.appendChild(column);
  });

  // body
  const data = await DB.getClipsInMovieFromDB(movieId);

  // clean up data returned by DB
  const clipsWithEmotions = utils.combineClipEmotion(data);

  clipsWithEmotions.forEach((clip) => {
    createClipRow(clip, clipsAttributes, clipsTableBody);
  });

  clipsTableBody.addEventListener("click", updateFieldOverlay);
  return clipsTable;
}

export function createAddDeleteOpenButton(
  parentClipRow,
  addCallback,
  deleteCallback,
  openCallback
) {
  const firstTd = parentClipRow.firstChild;

  // float buttons
  const divButtons = document.createElement("div");
  divButtons.classList.add("front-button-wrap");

  const addButton = document.createElement("div");
  addButton.innerText = "+";

  const deleteButton = document.createElement("div");
  deleteButton.innerText = "x";

  divButtons.append(addButton, deleteButton);
  parentClipRow.appendChild(divButtons);

  const openButton = document.createElement("div");
  openButton.classList.add("open-button-style");
  openButton.innerText = "Open";

  [addButton, deleteButton, openButton].forEach((button) => {
    button.classList.add("btn-small");
  });

  buttonClickEventAdd(addButton, addCallback);
  buttonClickEventDelete(deleteButton, deleteCallback);

  if (openCallback) {
    buttonClickEventOpen(openButton, openCallback);
    firstTd.appendChild(openButton);
  }
}

function hoverEventsToButton(button) {
  button.addEventListener("mouseenter", (e) => {
    e.currentTarget.classList.add("bg-dark");
  });

  button.addEventListener("mouseout", (e) => {
    e.currentTarget.classList.remove("bg-dark");
  });
}

// helper function to handle click add button
async function clickAdd(e) {
  const movie_id = e.currentTarget.closest(".overlay-window").id;
  const tableBody = e.currentTarget.closest("tbody");
  const currentTr = e.currentTarget.closest("tr");
  const data = await DB.insertClip(movie_id);

  const inserted_id = data.insertId;
  const clip = {
    clip_id: inserted_id,
    description: "",
    emotion_ids: [],
    emotion_names: [],
    timecode: "00:00:00",
  };
  createClipRow(
    clip,
    ["description", "timecode", "emotions"],
    tableBody,
    currentTr
  );
}

function buttonClickEventAdd(button, clickCallback) {
  hoverEventsToButton(button);

  button.addEventListener("click", clickCallback);
}

async function clickDelete(e) {
  const tr = e.currentTarget.closest("tr");
  const clip_id = tr.id;
  await DB.deleteClip(clip_id);
  tr.remove();
}

function buttonClickEventDelete(button, clickCallback) {
  hoverEventsToButton(button);

  button.addEventListener("click", clickCallback);
}

function buttonClickEventOpen(button, clickCallback) {
  hoverEventsToButton(button);

  button.addEventListener("click", clickCallback);
}
