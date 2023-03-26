import { overlayContainer } from "../utils/config.js";

export function createOverlaySection(
  callback_update,
  updateReference,
  x = 100,
  y = 100
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
  divPos.setAttribute(
    "style",
    `position: fixed;left: ${x}px;top: ${y}px;pointer-events: none;`
  );

  const divEventEnable = document.createElement("div");
  divEventEnable.setAttribute(
    "style",
    "position: relative; top: 100%; pointer-events: auto;"
  );

  divPos.appendChild(divEventEnable);
  divTop.appendChild(divBlock);
  divTop.appendChild(divPos);

  overlayContainer.appendChild(divTop);

  divBlock.addEventListener("click", (e) => {
    overlayContainer.removeChild(overlayContainer.lastChild);
    callback_update(updateReference);
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
  callback_createOverlay(rect.x, rect.y, data);
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

  const divDot = document.createElement("div");
  divDot.id = "dot";

  const divText = document.createElement("div");

  divText.appendChild(document.createTextNode(text));

  divWrap.appendChild(divDot);
  divWrap.appendChild(divText);

  return divWrap;
}
