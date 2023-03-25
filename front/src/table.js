import { baseurl } from "./config.js";

const tableHeaderRow = document.querySelector("#table-header-row");
const tableBody = document.querySelector("tbody");
const tableHead = document.querySelector("thead");
const overlayContainer = document.querySelector(".overlay-container");

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

// helper method to retrive all emotions
async function getEmotionsFromDB() {
  const response = await fetch(`${baseurl}/emotions`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

async function createEmotionHeader() {
  const records = await getEmotionsFromDB();
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

// helper method to retrive all clips from a movie with emotion
async function getClipsEmotionInMovieFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}/clips/emotions`, {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

function createRow(category, tr, emotion) {
  if (category.length !== 0) {
    const td = document.createElement("td");
    td.setAttribute("id", emotion);
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

async function getMovieNameFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}`, {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

async function createClipRow(movieId) {
  const clipsCategory = [];

  emotions.forEach((emotion) => {
    clipsCategory.push([]);
  });

  const tr = document.createElement("tr");
  tr.setAttribute("id", movieId);
  tableBody.appendChild(tr);

  const clips = await getClipsEmotionInMovieFromDB(movieId);

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
  const movieName = await getMovieNameFromDB(movieId);
  movieTd.appendChild(document.createTextNode(movieName[0].movie_name));
}

async function handleMovieOverlay(movieId, clicked) {
  createOverlayMovie(movieId, clicked);
}

async function handleEmotionOverlay() {
  console.log("emotion");
}

async function hanleOverlayHead(e) {
  if (e.target.nodeName === "TH") {
    handleEmotionOverlay(e);
  }
}

function getMovieIdAndEmotionId(clicked) {
  // becasue the clicked item is a td
  // the tr.id is movieId
  return { movieId: clicked.parentElement.id, emotionId: clicked.id, clicked };
}

async function getClipsMatchFromDB(input) {
  const { movieId, emotionId, clicked } = input;
  // get all clips with matching movie_id and emotion_id
  const response = await fetch(`${baseurl}/clips/${movieId}/${emotionId}`, {
    method: "GET",
  });
  const data = await response.json();

  const descriptions = data.map((clip) => {
    return clip.description;
  });

  return { descriptions, clicked };
}

function createOverlayClip(x, y, data) {
  const { descriptions, clicked } = data;

  const divEventEnable = createOverlaySection(clicked, x, y);

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");

  descriptions.forEach((d) => {
    const newdivWrap = createOverlayEmbed(d);
    divBox.appendChild(newdivWrap);
  });

  divEventEnable.appendChild(divBox);
}

async function handleOverlayBody(e) {
  if (e.target.classList.contains("movie-title")) {
    const movieId = e.target.parentElement.id;
    handleMovieOverlay(movieId, e.target.parentElement);
  } else {
    handleOverlay(
      e,
      getMovieIdAndEmotionId,
      getClipsMatchFromDB,
      createOverlayClip
    );
  }
}

async function handleOverlay(
  e,
  callback_getParam,
  callback_getData,
  callback_createOverlay
) {
  let clicked = e.target;
  const clickedParent = e.target.parentElement;

  // if I clicked in side the td
  if (clickedParent.classList.contains("dropDown-enable")) {
    clicked = clickedParent;
  }
  // if empty cell
  else if (!clicked.classList.contains("dropDown-enable")) {
    return;
  }

  const input = callback_getParam(clicked);
  const data = await callback_getData(input);

  const rect = clicked.getBoundingClientRect();
  // callback_createOverlay(rect.x, rect.y + clicked.clientHeight, data);
  callback_createOverlay(rect.x, rect.y, data);
}

function createOverlaySection(updateReference, x = 100, y = 100) {
  const divTop = document.createElement("div");
  divTop.setAttribute(
    "style",
    "pointer-events: auto; position: relative; z-index: 0"
  );

  const divBlock = document.createElement("div");
  divBlock.setAttribute(
    "style",
    "position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; "
  );

  const divPos = document.createElement("div");
  divPos.setAttribute(
    "style",
    `position: fixed;left: ${x}px;top: ${y}px;pointer-events: none;`
  );

  const divEventEnable = document.createElement("div");
  divEventEnable.setAttribute(
    "style",
    "position: relative; top: 100%; pointer-events: auto;"
  );

  divPos.appendChild(divEventEnable);

  divTop.appendChild(divBlock);
  divTop.appendChild(divPos);

  overlayContainer.appendChild(divTop);

  divBlock.addEventListener("click", (e) => {
    console.log(updateReference);
    overlayContainer.removeChild(overlayContainer.lastChild);
  });

  return divEventEnable;
}

async function createOverlayMovie(movieId, clicked) {
  const movieName = await getMovieNameFromDB(movieId);

  const divEventEnable = createOverlaySection(clicked);

  const divWindow = document.createElement("div");
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(movieName[0].movie_name));

  divWindow.appendChild(title);

  const table = await createClipsTable(movieId);
  divWindow.appendChild(table);

  divEventEnable.appendChild(divWindow);
}

async function clipsInMovieFromDB(movieId) {
  const response = await fetch(`${baseurl}/movies/${movieId}/clips`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
}

function combineClipEmotion(data) {
  const clipsWithEmotions = [];

  for (const clip of data) {
    const { clip_id, timecode, description, emotion_name, emotion_id } = clip;
    const existingClip = clipsWithEmotions.find((c) => c.clip_id === clip_id);
    if (existingClip) {
      existingClip.emotions.push(emotion_name);
      existingClip.ids.push(emotion_id);
    } else {
      clipsWithEmotions.push({
        clip_id,
        timecode,
        description,
        ids: emotion_id ? [emotion_id] : [],
        emotions: emotion_name ? [emotion_name] : [],
      });
    }
  }

  return clipsWithEmotions;
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
  const data = await clipsInMovieFromDB(movieId);

  // clean up data returned by DB
  const clipsWithEmotions = combineClipEmotion(data);

  clipsWithEmotions.forEach((clip) => {
    const BodyTr = document.createElement("tr");
    BodyTr.id = clip.clip_id;
    clipsTableBody.appendChild(BodyTr);

    clipsAttributes.forEach((attribute) => {
      const td = document.createElement("td");
      if (attribute === "emotions") {
        clip[attribute].forEach((emotion, index) => {
          const divEmotion = document.createElement("div");
          divEmotion.id = clip["ids"][index];
          divEmotion.appendChild(document.createTextNode(emotion));
          td.appendChild(divEmotion);
        });
        td.classList.add("dropDown-enable");
      } else {
        td.appendChild(document.createTextNode(clip[attribute]));
      }
      BodyTr.appendChild(td);
    });
  });

  clipsTableBody.addEventListener("click", updateFieldOverlay);
  return clipsTable;
}

function getClipEmotions(clicked) {
  const clipId = clicked.parentElement.id;
  const divs = clicked.querySelectorAll("div");
  const emotions = [];
  const emotionIds = [];

  for (let i = 0; i < divs.length; i++) {
    emotions.push(divs[i].textContent);
    emotionIds.push(divs[i].id);
  }

  return { emotions, emotionIds, clipId, clicked };
}

async function getAllEmotions(input) {
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

async function LinkEmotion(e, method) {
  // topmost visable overlay container
  const divBox = e.target.closest(".overlay-box");
  const clipId = divBox.id;
  // div that contains the information
  const emotionElement = e.target.closest(".no-wrap");
  const emotionId = emotionElement.id;
  const emotionName = emotionElement.querySelector(":nth-child(2)").textContent;

  const anotherEmotionTag =
    method === "POST" ? ".linked-emotion" : ".unlinked-emotion";

  const oppositeMethod = method === "POST" ? "DELETE" : "POST";
  const divAnother = divBox.querySelector(anotherEmotionTag);

  const newdivWrap = createOverlayEmbed(
    emotionName,
    LinkEmotion,
    oppositeMethod
  );
  newdivWrap.id = emotionId;
  divAnother.appendChild(newdivWrap);

  // remove from linked
  emotionElement.remove();

  const response = await fetch(
    `${baseurl}/clips/${clipId}/emotions/${emotionId}`,
    {
      method: method,
    }
  );
}

function createOverlayEmotion(x, y, data) {
  const {
    emotions,
    emotionIds,
    unlinkedEmotions,
    unlinkedEmotionIds,
    clipId,
    clicked,
  } = data;

  const divEventEnable = createOverlaySection(clicked, x, y);

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");
  divBox.id = clipId;

  const divFilter = document.createElement("div");
  divFilter.classList.add("filter");

  const filterInput = document.createElement("input");
  filterInput.setAttribute("type", "text");
  filterInput.setAttribute("placeholder", "Link or create a page");

  divFilter.appendChild(filterInput);
  divBox.appendChild(divFilter);

  const linkedEmotionsLabel = document.createElement("label");
  linkedEmotionsLabel.textContent = "Linked Emotions";
  divBox.appendChild(linkedEmotionsLabel);

  const divLinked = document.createElement("div");
  divLinked.classList.add("linked-emotion");

  emotions.forEach((d, index) => {
    const newdivWrap = createOverlayEmbed(d, LinkEmotion, "DELETE");
    newdivWrap.id = emotionIds[index];
    divLinked.appendChild(newdivWrap);
  });

  divBox.appendChild(divLinked);

  const unlinkedEmotionsLabel = document.createElement("label");
  unlinkedEmotionsLabel.textContent = "Unlinked Emotions";
  divBox.appendChild(unlinkedEmotionsLabel);

  const divUnlinked = document.createElement("div");
  divUnlinked.classList.add("unlinked-emotion");

  unlinkedEmotions.forEach((d, index) => {
    const newdivWrap = createOverlayEmbed(d, LinkEmotion, "POST");
    newdivWrap.id = unlinkedEmotionIds[index];
    divUnlinked.appendChild(newdivWrap);
  });

  divBox.appendChild(divUnlinked);

  divEventEnable.appendChild(divBox);
}

function updateFieldOverlay(e) {
  handleOverlay(e, getClipEmotions, getAllEmotions, createOverlayEmotion);
}

function createOverlayEmbed(text, callback_click, method) {
  const divWrap = document.createElement("div");
  divWrap.classList.add("text");
  divWrap.classList.add("no-wrap");

  const divDot = document.createElement("div");
  divDot.id = "dot";

  const divText = document.createElement("div");

  divText.appendChild(document.createTextNode(text));

  divWrap.appendChild(divDot);
  divWrap.appendChild(divText);

  divWrap.addEventListener("click", (e) => {
    if (!callback_click) console.log(text);
    else {
      callback_click(e, method);
    }
  });

  return divWrap;
}

async function init() {
  await createEmotionHeader();
  createClipRow(1);
}

tableBody.addEventListener("click", handleOverlayBody);
tableHead.addEventListener("click", hanleOverlayHead);
init();
