import {
  handleOverlay,
  createOverlaySection,
} from "../markersMain/generalOverlay";

import { overlayContainer } from "../utils/config";
import insertText from "insert-text-at-cursor";

import { createDraggable } from "./dragAndDropCategory";

import {
  updateEmotionName,
  insertEmotion,
  deleteEmotion,
  getEmotionsFromDB,
  getEmotionNameFromDB,
} from "../utils/accessDB";

import { validateInputText } from "../utils/utils";

const addEmotionButton = document.querySelector("#add-emotion-button");
const emotionInput = document.getElementById("emotion-input");
const itemList = document.getElementById("item-list");

async function displayItems() {
  const records = await getEmotionsFromDB();

  records.forEach((record) => {
    addItemToDOM(record.emotion_name, record.emotion_id);
    createDraggable(record.emotion_name, record.emotion_id, record.category);
  });

  resetUI();
}

async function onAddItemSubmit(e) {
  const newEmotion = emotionInput.value.trim();

  if (!validateInputText(newEmotion, emotionInput)) {
    return;
  }

  const insertResponse = await insertEmotion(newEmotion);
  const emotionId = await insertResponse.insertId;

  // Create item DOM element
  addItemToDOM(newEmotion, emotionId);

  resetUI();
}

// helper method to create the emotion card
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

// helper method to create the emotion card
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToDOM(item, itemId) {
  // Create list item
  const li = document.createElement("li");
  li.classList.add("dropDown-enable");

  li.setAttribute("id", itemId);

  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-remove");
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

// ---------------------------------   Overlay starts   ----------------------------------------------

function getEmotionLi(clicked) {
  const emotion_name = clicked.firstChild.textContent;
  const emotion_id = clicked.id;

  return { emotion_name, emotion_id, clicked };
}

async function updateEmotionLi(updateReference) {
  const emotion_id = updateReference.id;

  const newName = await getEmotionNameFromDB(emotion_id);

  updateReference.firstChild.textContent = newName[0].emotion_name;
}

function createEmojiPicker(emotion_name) {
  const divWrapper = document.createElement("div");

  // create the parent div element
  const emotionInputSubmit = document.createElement("div");
  emotionInputSubmit.setAttribute("id", "emotion-input-submit");

  // create the input element and set its attributes
  const input = document.createElement("input");
  input.setAttribute("id", "emotion-input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Type here");

  input.value = emotion_name;

  // append the label and button elements to the parent div element
  emotionInputSubmit.appendChild(input);

  // create the emoji-picker element
  const emojiPicker = document.createElement("emoji-picker");

  emojiPicker.addEventListener("emoji-click", (e) => {
    insertText(input, e.detail.unicode);
  });

  divWrapper.append(emotionInputSubmit, emojiPicker);

  return { divWrapper, input };
}

function createOverlayEmotionUpdate(x, y, data) {
  const { emotion_name, emotion_id, clicked } = data;

  const divEventEnable = createOverlaySection(
    updateEmotionLi,
    clicked,
    x < window.innerWidth / 2 - window.scrollX ? x + 150 : x - 345,
    y - 250,
    500,
    345
  );

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");

  divBox.style.maxHeight = "100%";

  const { divWrapper, input } = createEmojiPicker(emotion_name);

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      await updateEmotionName(emotion_id, input.value);

      // use enter to trigger click event, as if I have clicked out of overlay
      const nextDivBlockTrigger =
        overlayContainer.lastChild.querySelector(".stop-event");
      nextDivBlockTrigger.click();
    }
  });

  divBox.appendChild(divWrapper);
  divEventEnable.appendChild(divBox);
  input.focus();
  input.selectionStart = 0;
  input.selectionEnd = 0;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.closest(".dropDown-enable")) {
    const li = e.target.closest(".dropDown-enable");

    handleOverlay(e, getEmotionLi, null, createOverlayEmotionUpdate);
  }
}

function removeItem(item) {
  if (confirm(`Do you want to delete [${item.textContent}]?`)) {
    // Remove item from DOM
    deleteEmotion(item.id);
    item.remove();
  }
}

function resetUI() {
  emotionInput.value = "";
}

// Initialize app
function init() {
  // Event Listeners
  addEmotionButton.addEventListener("click", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  document.addEventListener("DOMContentLoaded", displayItems);

  document
    .querySelector("emoji-picker")
    .addEventListener("emoji-click", (e) => {
      insertText(document.querySelector("#emotion-input"), e.detail.unicode);
    });

  // Global ESC click to close the frontmost overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlayContainer.lastChild) {
      const nextDivBlockTrigger =
        overlayContainer.lastChild.querySelector(".stop-event");

      nextDivBlockTrigger.click();
    }
  });

  resetUI();
}

init();
