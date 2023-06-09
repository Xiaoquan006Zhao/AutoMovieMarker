import { overlayContainer } from "../utils/config.js";
import * as utils from "../utils/utils.js";

export function createOverlaySection(
  callback_update,
  updateReference,
  x,
  y,
  height,
  width
) {
  const divTop = document.createElement("div");
  divTop.setAttribute(
    "style",
    "pointer-events: auto; position: relative; z-index: 0"
  );

  const divBlock = document.createElement("div");
  divBlock.classList.add("stop-event");
  divBlock.setAttribute(
    "style",
    "position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; "
  );

  const divPos = document.createElement("div");

  if (x && y) {
    divPos.setAttribute(
      "style",
      `position: fixed;left: ${x}px;top: ${y}px;pointer-events: none;`
    );
  } else {
    divPos.setAttribute(
      "style",
      `position: fixed;left: 50%;top: 50%; transform: translate(-50%, -50%); pointer-events: none;`
    );
  }

  if (height) {
    divPos.style.height = height + "px";
  }
  if (width) {
    divPos.style.width = width + "px";
  }

  const divEventEnable = document.createElement("div");
  divEventEnable.setAttribute(
    "style",
    "position: relative; top: 0%; pointer-events: auto;"
  );

  divPos.appendChild(divEventEnable);
  divTop.append(divBlock, divPos);

  overlayContainer.appendChild(divTop);

  // click out
  divBlock.addEventListener("click", async (e) => {
    overlayContainer.removeChild(overlayContainer.lastChild);
    await callback_update(updateReference);
  });

  return divEventEnable;
}

export async function handleOverlay(
  e,
  callback_getParam,
  callback_getData,
  callback_createOverlay
) {
  const clicked = e.target.closest(".dropDown-enable");

  if (!clicked) return;

  const input = callback_getParam(clicked, e);

  const data = callback_getData ? await callback_getData(input) : input;

  const rect = clicked.getBoundingClientRect();
  // callback_createOverlay(rect.x, rect.y + clicked.clientHeight, data);
  callback_createOverlay(rect.left, rect.top, data);
}

export function createEmotionEmbed(clip, parentElement) {
  clip["emotion_names"].forEach((emotion, index) => {
    const divEmotion = document.createElement("div");
    divEmotion.id = clip["emotion_ids"][index];
    divEmotion.appendChild(document.createTextNode(emotion));
    parentElement.appendChild(divEmotion);
  });

  parentElement.classList.add("dropDown-emotion");
  parentElement.classList.add("dropDown-enable");
  return parentElement;
}

export function createOverlayEmbed(text) {
  const divWrap = document.createElement("div");
  divWrap.classList.add("no-wrap");

  const spanText = document.createElement("span");
  spanText.classList.add("emotion-text");
  spanText.classList.add("dot-icon");

  spanText.appendChild(document.createTextNode(text));

  divWrap.appendChild(spanText);

  return divWrap;
}

export function createButtons(parent, buttonSetup) {
  // float buttons
  const divButtons = document.createElement("div");
  divButtons.classList.add("front-button-wrap");

  buttonSetup.forEach((button) => {
    const addButton = document.createElement("div");
    addButton.innerText = button.content;
    divButtons.appendChild(addButton);
    addButton.classList.add("btn-small");
    buttonClickEventAdd(addButton, button.callback);
  });

  parent.appendChild(divButtons);
}

function buttonClickEventAdd(button, clickCallback) {
  button.addEventListener("click", clickCallback);
}
