import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlayEmbed,
  createOverlaySection,
} from "./overlayGeneral.js";

import { updateFieldOverlay } from "./emotionOverlay.js";
import { createMovieRow } from "./markersPage.js";

export async function handleMovieOverlay(movieId, clicked) {
  createOverlayMovie(movieId, clicked);
}

export async function updateMovie(updateReference) {
  const tableElement = updateReference.parentElement;
  const newElement = await createMovieRow(updateReference.id);

  const siblingElement = updateReference.nextSibling;
  tableElement.insertBefore(newElement, siblingElement);

  updateReference.remove();
}

async function createOverlayMovie(movieId, clicked) {
  const movieName = await DB.getMovieNameFromDB(movieId);

  const divEventEnable = createOverlaySection(updateMovie, clicked);

  const divWindow = document.createElement("div");
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(movieName[0].movie_name));

  divWindow.appendChild(title);

  const table = await createClipsTable(movieId);
  divWindow.appendChild(table);

  divEventEnable.appendChild(divWindow);
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
    const BodyTr = document.createElement("tr");
    BodyTr.id = clip.clip_id;
    clipsTableBody.appendChild(BodyTr);

    clipsAttributes.forEach((attribute) => {
      const td = document.createElement("td");
      if (attribute === "emotions") {
        BodyTr.appendChild(createEmotionEmbed(clip, td));
      } else {
        td.appendChild(document.createTextNode(clip[attribute]));
        BodyTr.appendChild(td);
      }
    });
  });

  clipsTableBody.addEventListener("click", updateFieldOverlay);
  return clipsTable;
}
