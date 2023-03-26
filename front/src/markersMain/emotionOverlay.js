import * as DB from "../utils/accessDB.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlayEmbed,
  createOverlaySection,
} from "./overlayGeneral.js";

export function updateFieldOverlay(e) {
  handleOverlay(
    e,
    getClipEmotions,
    DB.getEmotionsLinkedAndUnlinedFromDB,
    createOverlayEmotion
  );
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
  const clip_id = updateReference.parentElement.id;

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

function createOverlayEmotion(x, y, data) {
  const {
    emotions,
    emotionIds,
    unlinkedEmotions,
    unlinkedEmotionIds,
    clipId,
    clicked,
  } = data;

  const divEventEnable = createOverlaySection(updateEmotion, clicked, x, y);

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
}
