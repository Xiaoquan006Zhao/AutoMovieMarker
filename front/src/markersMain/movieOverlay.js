import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlaySection,
  createButtons,
} from "./generalOverlay.js";

import { updateFieldOverlay, updateMovietitleOverlay } from "./subOverlay.js";
import { createMovieRow } from "./markersPage.js";
import { applyFilters } from "./filterEmotion";
import { handleClipOverlay } from "./clipDetailsOverlay.js";

export async function updateMovie(updateReference) {
  if (utils.isTopLevelUpdated()) {
    const tableElement = updateReference.parentElement;
    const newElement = await createMovieRow(updateReference.id);

    const siblingElement = updateReference.nextSibling;
    tableElement.insertBefore(newElement, siblingElement);

    updateReference.remove();
    applyFilters();
  }
}

export async function createOverlayMovie(movieId, clicked) {
  const movieName = await DB.getMovieName(movieId);

  const divEventEnable = createOverlaySection(updateMovie, clicked);

  const divWindow = document.createElement("div");
  divWindow.id = movieId;
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(movieName.movie_name));
  title.classList.add("dropDown-enable");
  title.classList.add("dropDown-text");

  title.addEventListener("click", updateMovietitleOverlay);

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

  const buttonSetup = [];
  buttonSetup.push({
    content: "+",
    callback: clickAdd,
  });
  buttonSetup.push({
    content: "x",
    callback: clickDelete,
  });

  BodyTr.addEventListener("mouseenter", (e) => {
    createButtons(BodyTr, buttonSetup);

    const openButton = document.createElement("div");
    openButton.classList.add("open-button-style");
    openButton.innerText = "Open";
    openButton.classList.add("btn-small");
    openButton.addEventListener("click", (e) => {
      // Because openButton is inside descriptionTd
      // Avoid activating updateDescriptionTd
      e.stopPropagation();
      handleClipOverlay(e);
    });
    BodyTr.firstChild.appendChild(openButton);
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
  const data = await DB.getAllClipsInMovie(movieId);

  // clean up data returned by DB
  const clipsWithEmotions = utils.combineClipEmotion(data);

  clipsWithEmotions.forEach((clip) => {
    createClipRow(clip, clipsAttributes, clipsTableBody);
  });

  clipsTableBody.addEventListener("click", updateFieldOverlay);
  return clipsTable;
}

// helper function to handle click add button
async function clickAdd(e) {
  utils.topLevelUpdate();
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
    timecode: "00:00:00:00",
  };
  createClipRow(
    clip,
    ["description", "timecode", "emotions"],
    tableBody,
    currentTr
  );
}

async function clickDelete(e) {
  utils.topLevelUpdate();
  const tr = e.currentTarget.closest("tr");
  const clip_id = tr.id;
  await DB.deleteClip(clip_id);
  tr.remove();
}
