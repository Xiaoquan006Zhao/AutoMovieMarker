import {
  handleOverlay,
  createOverlaySection,
} from "../markersMain/generalOverlay";

import { overlayContainer } from "../utils/config";

import {
  updateEmotion,
  insertEmotion,
  deleteEmotion,
  getEmotionsFromDB,
  getEmotionNameFromDB,
} from "../utils/accessDB";

const itemForm = document.querySelector("#item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");

tinymce.init({
  selector: "#item-input",
  plugins: "emoticons",
  toolbar: "emoticons",
  height: 150,
  width: "100%",
  menubar: false,
});

async function displayItems() {
  const records = await getEmotionsFromDB();

  records.forEach((record) => {
    addItemToDOM(record.emotion_name, record.emotion_id);
  });

  resetUI();
}

async function onAddItemSubmit(e) {
  e.preventDefault();

  const newEmotion = tinymce.get("item-input").getContent({ format: "text" });

  // Validate Input
  if (newEmotion === "") {
    alert("Please add an item");
    return;
  }

  // Add item to storage
  const insertResponse = await insertEmotion(newEmotion);
  const emotionId = await insertResponse.insertId;

  // Create item DOM element
  addItemToDOM(newEmotion, emotionId);

  resetUI();

  itemInput.value = "";
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

function createOverlayEmotionUpdate(x, y, data) {
  const { emotion_name, emotion_id, clicked } = data;

  const divEventEnable = createOverlaySection(
    updateEmotionLi,
    clicked,
    x,
    y,
    200,
    300
  );

  const divBox = document.createElement("div");
  divBox.classList.add("overlay-box");

  const form = document.createElement("form");
  form.setAttribute("id", "emotion-form");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "form-input");
  input.setAttribute("id", "emotion-input");
  input.setAttribute("name", "item");
  input.setAttribute("placeholder", "Enter Emotion Category");
  input.value = emotion_name;
  form.appendChild(input);

  tinymce.init({
    selector: "#emotion-input",
    plugins: "emoticons",
    toolbar: "emoticons",
    height: 150,
    width: "100%",
    menubar: false,
  });

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      await updateEmotion(emotion_id, input.value);

      // use enter to trigger click event, as if I have clicked out of overlay
      const nextDivBlockTrigger =
        overlayContainer.lastChild.querySelector(".stop-event");
      nextDivBlockTrigger.click();
    }
  });

  divBox.appendChild(form);
  divBox.setAttribute("lang", "en");

  divEventEnable.appendChild(divBox);
  input.focus();
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.closest(".dropDown-enable")) {
    const li = e.target.closest(".dropDown-enable");
    console.log(li.firstChild.textContent);

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
  itemInput.value = "";
  tinyMCE.activeEditor.setContent("");
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  document.addEventListener("DOMContentLoaded", displayItems);

  resetUI();
}

init();
