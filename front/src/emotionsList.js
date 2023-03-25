const itemForm = document.querySelector("#item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const formBtn = itemForm.querySelector(".btn-primary");

import { baseurl } from "./config.js";

tinymce.init({
  selector: "#item-input",
  plugins: "emoticons",
  toolbar: "emoticons",
  height: 150,
  width: "100%",
  menubar: false,
});

async function displayItems() {
  const records = await getItemsFromStorage();

  records.forEach((record) => {
    addItemToDOM(record.emotion_name, record.emotion_id);
  });
  resetUI();
}

async function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = tinymce.get("item-input").getContent({ format: "text" });

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Add item to storage
  const itemId = await addItemToStorage(newItem);

  // Create item DOM element
  addItemToDOM(newItem, itemId);

  resetUI();

  itemInput.value = "";
}

function addItemToDOM(item, itemId) {
  // Create list item
  const li = document.createElement("li");
  li.setAttribute("id", itemId);

  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-remove");
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

async function addItemToStorage(item) {
  const response = await fetch(`${baseurl}/emotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: item }),
  });

  const data = await response.json();

  return data;
}

async function getItemsFromStorage() {
  const response = await fetch(`${baseurl}/emotions`, {
    method: "GET",
  });
  const data = await response.json();

  return data;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  }
}

function removeItem(item) {
  if (confirm(`Do you want to delete [${item.textContent}]?`)) {
    // Remove item from DOM
    removeItemFromStorage(item.id);
    item.remove();
  }
}

async function removeItemFromStorage(itemId) {
  const response = await fetch(`${baseurl}/emotions/${itemId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  console.log(data);
}

function clearItems() {
  while (itemList.firstChild) {
    removeItemFromStorage(itemList.firstChild.id);
    itemList.removeChild(itemList.firstChild);
  }

  resetUI();
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

  const clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", clearItems);

  resetUI();
}

init();
