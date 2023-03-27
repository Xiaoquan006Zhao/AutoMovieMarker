import { overlayContainer } from "../utils/config.js";
import * as DB from "../utils/accessDB.js";
import {
  handleOverlay,
  createEmotionEmbed,
  createOverlaySection,
} from "./generalOverlay.js";

import { updateFieldOverlay } from "./subOverlay.js";

function getClipId(clicked, e) {
  const tooltip = e.target.closest(".tooltip");

  // opened from main page's clip descriptions or movie page clip table
  const clipId = tooltip ? tooltip.id : e.target.closest("tr").id;

  return { clipId, clicked };
}

function updateClip(updateReference) {
  // triggers the next callback in the overlay.
  const nextDivBlockTrigger =
    overlayContainer.lastChild.querySelector(".stop-event");

  nextDivBlockTrigger.click();
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
  divWindow.classList.add("overlay-window");

  const title = document.createElement("h1");
  title.appendChild(document.createTextNode(description));
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
  imageElement.setAttribute("src", image_url);
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
  handleOverlay(e, getClipId, DB.getClipDetailFromDB, createOverlayClipDetails);
}
