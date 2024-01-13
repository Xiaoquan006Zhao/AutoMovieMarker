import * as DB from "../utils/accessDB.js";
import * as utils from "../utils/utils.js";

import {
  handleOverlay,
  createEmotionEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

import { updateFieldOverlay } from "./subOverlay.js";

function getClipId(clicked, e) {
  const noWrap = e.target.closest(".no-wrap");

  clicked = noWrap ? noWrap : clicked.closest("tr");

  // opened from main page's clip descriptions or movie page clip table
  const clip_id = noWrap ? noWrap.id : e.target.closest("tr").id;
  return { clip_id, clicked };
}

async function updateClip(updateReference) {
  // passing true because this is the middle layer
  if (utils.isTopLevelUpdated(true)) {
    const { clipsWithEmotion } = await DB.getClipDetail({
      clip_id: updateReference.id,
    });
    const { description, timecode, emotion_ids, emotion_names } =
      clipsWithEmotion[0];

    if (updateReference.tagName === "TR") {
      const tds = updateReference.querySelectorAll("td");

      // because just setting textcontent will delete open button
      tds[0].childNodes[0].textContent = description;
      tds[1].textContent = timecode;

      // update emotions
      const emotionWrapper = tds[2].querySelector(".dropDown-emotion");
      while (emotionWrapper.firstChild) {
        emotionWrapper.removeChild(emotionWrapper.firstChild);
      }
      emotion_names.forEach((emotion_name, index) => {
        const divEmotion = document.createElement("div");
        divEmotion.id = emotion_ids[index];
        divEmotion.appendChild(document.createTextNode(emotion_name));

        emotionWrapper.appendChild(divEmotion);
      });
    } else {
      // or just triggers the next callback in the overlay (essenially close it)
      utils.doubleCloseOverlay();
    }
  } else {
    if (updateReference.tagName !== "TR") {
      utils.doubleCloseOverlay();
    }
  }
}

function createOverlayClipDetails(x, y, data) {
  const { clipsWithEmotion, clicked } = data;

  const {
    clip_id,
    description,
    emotion_ids,
    emotion_names,
    image_url,
    movie_name,
    timecode,
  } = clipsWithEmotion[0];

  const attributes = {
    movie: movie_name,
    timecode: timecode,
    emotions: emotion_names,
    image_url: image_url,
  };

  const divEventEnable = createOverlaySection(updateClip, clicked);

  const divWindow = document.createElement("div");
  divWindow.id = clip_id;
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(description));
  title.classList.add("dropDown-enable");
  title.classList.add("dropDown-text");
  divWindow.appendChild(title);

  for (let key in attributes) {
    const data =
      key === "emotions"
        ? createEmotionEmbed(clipsWithEmotion[0], document.createElement("div"))
        : attributes[key];
    const newDiv = createAttributeDiv(key, data, clip_id);
    divWindow.appendChild(newDiv);
  }

  const imageElement = document.createElement("img");
  imageElement.setAttribute("src", "https://lh3.google.com/u/0/d/"+image_url);
  imageElement.setAttribute("alt", description);
  divWindow.appendChild(imageElement);

  divWindow.addEventListener("click", updateFieldOverlay);

  divEventEnable.appendChild(divWindow);
}

function createAttributeDiv(attributeName, attributeData, id) {
  const divRow = document.createElement("div");

  // creating Label
  const attributeLabel = document.createElement("label");
  attributeLabel.textContent = attributeName;
  divRow.appendChild(attributeLabel);

  // creating content
  if (typeof attributeData === "string") {
    const attributeContent = document.createElement("h3");
    attributeContent.appendChild(document.createTextNode(attributeData));
    attributeContent.classList.add("attribute-content");
    if (attributeName !== "movie") {
      attributeContent.classList.add("dropDown-text");
      attributeContent.classList.add("dropDown-enable");
    }

    divRow.appendChild(attributeContent);
  } else {
    attributeData.classList.add("attribute-content");
    divRow.appendChild(attributeData);
  }

  divRow.classList.add("attribute");
  divRow.id = id;
  return divRow;
}

export function handleClipOverlay(e) {
  handleOverlay(e, getClipId, DB.getClipDetail, createOverlayClipDetails);
}
