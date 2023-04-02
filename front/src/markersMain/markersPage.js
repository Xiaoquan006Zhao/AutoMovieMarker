import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";
import {
  handleOverlay,
  createEmotionEmbed,
  createOverlayEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

import {
  handleMovieOverlay,
  updateMovie,
  createAddDeleteOpenButton,
} from "./movieOverlay.js";
import { handleClipOverlay } from "./clipDetailsOverlay.js";
import { overlayContainer } from "../utils/config.js";

const tableHeaderRow = document.querySelector("#table-header-row");
const tableFilterRow = document.querySelector("#filters");
const tableBody = document.querySelector("tbody");
const tableHead = document.querySelector("thead");

let emotions = [];
let emotionsId = [];

// Global ESC click to close the frontmost overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlayContainer.lastChild) {
    const nextDivBlockTrigger =
      overlayContainer.lastChild.querySelector(".stop-event");

    nextDivBlockTrigger.click();
  }
});

// --------------------------------------------------------------- Populating the page with html elements

// helper method for applyFilters
function hideColumns(table, columnsNotToHide) {
  var columnCount = table.rows[0].cells.length;

  for (var i = 1; i < columnCount; i++) {
    var cell = table.rows[0].cells[i];
    var columnIndex = i;

    if (
      columnsNotToHide.length !== 0 &&
      columnsNotToHide.indexOf(columnIndex) === -1
    ) {
      cell.style.display = "none";
      for (var j = 0; j < table.rows.length; j++) {
        table.rows[j].cells[i].style.display = "none";
      }
    } else {
      cell.style.display = "";
      for (var j = 0; j < table.rows.length; j++) {
        table.rows[j].cells[i].style.display = "";
      }
    }
  }
}

// helper method for applyFilters
function hideRows(table, rowsToHide) {
  // Loop through each row in the table body
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    // Check if the row index should be hidden
    if (rowsToHide.includes(i)) {
      // Hide the row by setting its display property to "none"
      rows[i].style.display = "none";
    } else {
      // Show the row by resetting its display property
      rows[i].style.display = "";
    }
  }
}

// helper method for applyFilters
function getFilterValues() {
  var filters = document.querySelectorAll("#filters .table-filter");
  var filterValues = [];

  for (var i = 0; i < filters.length; i++) {
    var filter = filters[i];
    var selectElems = filter.querySelectorAll("select");
    var inputElem = filter.querySelector("input");
    var filterObj = {};

    filterObj.type = selectElems[0].value;
    filterObj.logic = selectElems[1].value;
    filterObj.input = inputElem.value;

    filterValues.push(filterObj);
  }

  return filterValues;
}

export function applyFilters() {
  const mainTable = tableBody.parentElement;

  const filterValues = getFilterValues().filter(
    (filter) => filter.input !== ""
  );

  // Hide columns
  const columnsNotToHide = [];
  filterValues.forEach((filter) => {
    if (filter.type === "Movie") {
      console.log("movie");
    }

    if (filter.type === "Emotion") {
      const filterEmotions = emotions.filter((emotion) =>
        filter.logic === "contains"
          ? emotion.toLowerCase().includes(filter.input.toLowerCase())
          : emotion.toLowerCase() === filter.input.toLowerCase()
      );

      filterEmotions.forEach((emotion) => {
        const index = emotions.indexOf(emotion);
        if (!columnsNotToHide.includes(index)) {
          columnsNotToHide.push(index);
        }
      });
    }
  });

  // Hide rows only if the columns are being filtered
  // but hiderows need to be outside to restore the default display mode
  const rowsToHide = [];

  if (columnsNotToHide.length !== 0) {
    const rows = tableBody.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
      let hideRow = true;
      for (let j = 0; j < columnsNotToHide.length; j++) {
        if (rows[i].cells[columnsNotToHide[j]].textContent.trim() !== "") {
          hideRow = false;
          break;
        }
      }
      if (hideRow) {
        // rows are selected from tbody, thus an extra emotions role need to be offset
        rowsToHide.push(i + 1);
      }
    }
  }

  if (filterValues.length !== 0 && columnsNotToHide.length === 0) {
    document.querySelector("#filter-warning").classList.remove("hidden");
  } else {
    document.querySelector("#filter-warning").classList.add("hidden");
  }

  hideRows(mainTable, rowsToHide);
  hideColumns(mainTable, columnsNotToHide);
}

function deleteFilter(e) {
  const thFilter = e.target.closest(".table-filter");
  const parent = thFilter.parentElement;
  parent.removeChild(thFilter);

  if (!parent.firstChild) {
    addFilter();
  }
  applyFilters();
}

function addFilter() {
  const thFilter = document.createElement("th");
  thFilter.classList.add("table-filter");

  const divSelect = document.createElement("div");
  divSelect.classList.add("select-filter");

  const typeInput = document.createElement("select");

  const optionEmotion = document.createElement("option");
  optionEmotion.value = "Emotion";
  optionEmotion.text = "Emotion";
  typeInput.appendChild(optionEmotion);

  const optionMovie = document.createElement("option");
  optionMovie.value = "Movie";
  optionMovie.text = "Movie";
  typeInput.appendChild(optionMovie);

  const logicInput = document.createElement("select");

  const optionContains = document.createElement("option");
  optionContains.value = "contains";
  optionContains.text = "Contains";
  logicInput.appendChild(optionContains);

  const optionIs = document.createElement("option");
  optionIs.value = "is";
  optionIs.text = "Is";
  logicInput.appendChild(optionIs);

  const valueInput = document.createElement("input");
  valueInput.setAttribute("type", "text");

  typeInput.addEventListener("change", applyFilters);
  logicInput.addEventListener("change", applyFilters);
  valueInput.addEventListener("input", applyFilters);

  divSelect.append(typeInput, logicInput);
  thFilter.append(divSelect, valueInput);

  thFilter.addEventListener("mouseenter", (e) => {
    createAddDeleteOpenButton(thFilter, addFilter, deleteFilter);
  });

  thFilter.addEventListener("mouseout", (e) => {
    const parent = e.currentTarget;
    const relatedTarget = e.relatedTarget;

    // Check if the relatedTarget is a child of BodyTr
    if (!parent.contains(relatedTarget)) {
      parent.removeChild(parent.lastChild);
    }
  });

  tableFilterRow.appendChild(thFilter);
  valueInput.focus();
}

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

async function init() {
  addFilter();

  await createEmotionHeader();

  tableBody.appendChild(await createMovieRow(1));
  tableBody.appendChild(await createMovieRow(2));

  tableBody.addEventListener("click", handleOverlayBody);

  // tableHead.addEventListener("click", hanleOverlayHead);
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
    y,
    clicked.clientHeight,
    clicked.clientWidth
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

init();
