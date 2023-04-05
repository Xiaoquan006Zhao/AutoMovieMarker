import { validateInputText } from "../utils/utils";

const items = document.querySelectorAll(".items li");
const categories = document.querySelectorAll(".category");

const addCategoryButton = document.querySelector("#add-category-button");
const categoryInput = document.getElementById("category-input");

addCategoryButton.addEventListener("click", (e) => {
  createCategory();
});

import { updateEmotionCategory } from "../utils/accessDB";

let draggedItem = null;

function init() {
  //   items.forEach((item) => {
  //     item.addEventListener("dragstart", addDragToLi);
  //   });
  //   categories.forEach((category) => {
  //     addDragAndDrop(category);
  //   });
}

function addDragToLi(e) {
  draggedItem = e.target;
  const category = e.target.closest(".category");
  category.classList.add("dropzone");
}

function addDragAndDrop(category) {
  category.addEventListener("dragenter", (e) => {
    const category = e.target.closest(".category");
    if (category) {
      e.currentTarget.classList.add("dropzone");
    }
  });

  category.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  category.addEventListener("dragleave", (e) => {
    const categoryElement = e.currentTarget;
    const relatedTarget = e.relatedTarget;

    if (!categoryElement.contains(relatedTarget)) {
      e.target.classList.remove("dropzone");
    }
  });

  category.addEventListener("drop", async (e) => {
    e.preventDefault();

    if (e.target.closest(".category")) {
      e.currentTarget.querySelector(".items").appendChild(draggedItem);
      e.currentTarget.classList.remove("dropzone");

      const newCategory = e.currentTarget.querySelector("h2").textContent;

      await updateEmotionCategory(draggedItem.id, newCategory);
    }
  });
}

export function createDraggable(emotion_name, emotion_id, emotion_category) {
  const li = document.createElement("li");
  li.setAttribute("draggable", true);
  li.id = emotion_id;
  li.appendChild(document.createTextNode(emotion_name));

  li.addEventListener("dragstart", addDragToLi);

  let categoryElement = document.querySelector(`#${emotion_category}`);

  if (!categoryElement) {
    categoryElement = createCategory(emotion_category);
  }

  categoryElement.querySelector("ul").appendChild(li);
}

function createCategory(categoryText) {
  const categoryName = categoryText ? categoryText : categoryInput.value.trim();

  if (!validateInputText(categoryName, categoryInput)) {
    return;
  }

  // const category =
  const divCategory = document.createElement("div");
  divCategory.classList.add("category");
  divCategory.id = categoryName;

  const h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(categoryName));

  const ul = document.createElement("ul");
  ul.classList.add("items");
  divCategory.append(h2, ul);

  addDragAndDrop(divCategory);

  document
    .querySelector(".categories")
    .insertBefore(
      divCategory,
      document.querySelector(".categories").lastElementChild
    );

  return divCategory;
}

init();
