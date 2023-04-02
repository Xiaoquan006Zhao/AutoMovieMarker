import * as DB from "../utils/accessDB.js";
import { overlayContainer } from "../utils/config.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlayEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

function getClipEmotions(clicked) {
  let tempId = clicked.parentElement.id;
  // opened from movie page or main page clip description
  const clipId = tempId ? tempId : clicked.closest("tr").id;

  const divs = clicked.querySelectorAll("div");
  const emotions = [];
  const emotionIds = [];

  for (let i = 0; i < divs.length; i++) {
    emotions.push(divs[i].textContent);
    emotionIds.push(divs[i].id);
  }

  return { emotions, emotionIds, clipId, clicked };
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

  const divAnother = divBox.querySelector(anotherEmotionTag);

  const newdivWrap = createOverlayEmbed(emotionName);
  newdivWrap.id = emotionId;
  divAnother.appendChild(newdivWrap);

  // remove from linked
  emotionElement.remove();

  DB.updateClipEmotionLink(clipId, emotionId, method);
}

async function updateEmotion(updateReference) {
  let tempId = updateReference.parentElement.id;
  const clip_id = tempId ? tempId : updateReference.closest("tr").id;

  const emotions = await DB.getEmotionInClipFromDB(clip_id);

  while (updateReference.firstChild) {
    updateReference.removeChild(updateReference.firstChild);
  }

  emotions.forEach((emotion) => {
    const divEmotion = document.createElement("div");
    divEmotion.id = emotion.emotion_id;
    divEmotion.appendChild(document.createTextNode(emotion.emotion_name));

    updateReference.appendChild(divEmotion);
  });
}

function filterOverlayEmotion(filterInput, divLinked, divUnlinked) {
  filterInput.addEventListener("input", (e) => {
    const filterValue = e.currentTarget.value.toLowerCase();
    const linkedEmotionsDivs = divLinked.querySelectorAll(".no-wrap");
    const unlinkedEmotionsDivs = divUnlinked.querySelectorAll(".no-wrap");

    linkedEmotionsDivs.forEach((div) => {
      const emotionText = div
        .querySelector(".emotion-text")
        .textContent.toLowerCase();

      if (emotionText.includes(filterValue)) {
        div.style.display = "";
      } else {
        div.style.display = "none";
      }
    });

    unlinkedEmotionsDivs.forEach((div) => {
      const emotionText = div
        .querySelector(".emotion-text")
        .textContent.toLowerCase();

      if (emotionText.includes(filterValue)) {
        div.style.display = "";
      } else {
        div.style.display = "none";
      }
    });
  });
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

  const divEventEnable = createOverlaySection(
    updateEmotion,
    clicked,
    x,
    y,
    clicked.offsetHeight,
    clicked.offsetWidth
  );

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
    const newdivWrap = createOverlayEmbed(d);
    newdivWrap.id = emotionIds[index];
    divLinked.appendChild(newdivWrap);
  });

  divLinked.addEventListener("click", (e) => LinkEmotion(e, "DELETE"));

  divBox.appendChild(divLinked);

  const unlinkedEmotionsLabel = document.createElement("label");
  unlinkedEmotionsLabel.textContent = "Unlinked Emotions";
  divBox.appendChild(unlinkedEmotionsLabel);

  const divUnlinked = document.createElement("div");
  divUnlinked.classList.add("unlinked-emotion");

  unlinkedEmotions.forEach((d, index) => {
    const newdivWrap = createOverlayEmbed(d);
    newdivWrap.id = unlinkedEmotionIds[index];
    divUnlinked.appendChild(newdivWrap);
  });

  divUnlinked.addEventListener("click", (e) => LinkEmotion(e, "POST"));

  divBox.appendChild(divUnlinked);

  divEventEnable.appendChild(divBox);

  filterOverlayEmotion(filterInput, divLinked, divUnlinked);
  filterInput.focus();
}

// ------------------------------  handle Emotion ends ------------------------------------------

function findFieldName(clicked) {
  let fieldName;
  if (clicked.tagName === "H3") {
    fieldName = clicked.parentElement.querySelector("label").textContent;
  } else if (clicked.tagName === "TD") {
    const column = clicked.cellIndex;

    const table = clicked.closest("table");
    const header = table.querySelector("thead").querySelector("tr");
    fieldName = header.querySelector(
      `th:nth-child(${clicked.cellIndex + 1})`
    ).textContent;
  }
  if (clicked.tagName === "H1") {
    fieldName = "description";
  }

  return fieldName;
}

function getClipField(clicked) {
  const text = clicked.firstChild.textContent;

  const fieldName = findFieldName(clicked);

  return { text, fieldName, clicked };
}

async function updateField(updateReference) {
  const clip_id = updateReference.parentElement.id;

  const fieldName = findFieldName(updateReference);

  const updated = await DB.getClipField(clip_id, fieldName);
  updateReference.firstChild.textContent = updated[0][fieldName];
}

async function createOverlayField(x, y, data) {
  const { text, fieldName, clicked } = data;

  const clip_id = clicked.parentElement.id;

  const divEventEnable = createOverlaySection(
    updateField,
    clicked,
    x,
    y,
    clicked.offsetHeight,
    clicked.offsetWidth
  );

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");
  divBox.classList.add("grow-wrap");

  const inputBox = document.createElement("textarea");
  inputBox.setAttribute("name", "text");
  inputBox.setAttribute("lang", "en");
  inputBox.id = "text";
  inputBox.setAttribute(
    "onInput",
    "this.parentNode.dataset.replicatedValue = this.value"
  );
  inputBox.value = text;

  inputBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (fieldName === "timecode") {
        // Define the regular expression pattern
        const pattern =
          /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]):\d+$/;

        // Test the string against the pattern
        const isMatching = pattern.test(inputBox.value);

        if (!isMatching) {
          alert(
            "Timecode is not of right format. \nExpect: hour:minute:second:frames"
          );
          return;
        }
      }
      await DB.updateClipField(clip_id, fieldName, inputBox.value);

      // use enter to trigger click event, as if I have clicked out of overlay
      const nextDivBlockTrigger =
        overlayContainer.lastChild.querySelector(".stop-event");
      nextDivBlockTrigger.click();
    }
  });

  divBox.appendChild(inputBox);
  divBox.setAttribute("lang", "en");
  inputBox.parentNode.dataset.replicatedValue = inputBox.value;

  divEventEnable.appendChild(divBox);
  inputBox.focus();
}

export function updateFieldOverlay(e) {
  if (e.target.closest(".dropDown-emotion")) {
    handleOverlay(
      e,
      getClipEmotions,
      DB.getEmotionsLinkedAndUnlinedFromDB,
      createOverlayEmotion
    );
  } else if (e.target.closest(".dropDown-text")) {
    handleOverlay(e, getClipField, null, createOverlayField);
  }
}
