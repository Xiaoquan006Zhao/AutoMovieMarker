const items = document.querySelectorAll(".items li");
const categories = document.querySelectorAll(".category");

let draggedItem = null;

items.forEach((item) => {
  item.addEventListener("dragstart", addDragToLi);
});

categories.forEach((category) => {
  addDragAndDrop(category);
});

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

  category.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.target.closest(".category")) {
      e.currentTarget.querySelector(".items").appendChild(draggedItem);
      e.currentTarget.classList.remove("dropzone");
    }
  });
}

function createCategory(categoryName) {
  const divCategory = document.createElement("div");
  divCategory.classList.add("category");
  divCategory.id = categoryName;

  const h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(categoryName));

  const ul = document.createElement("ul");
  divCategory.append(h2, ul);
}
