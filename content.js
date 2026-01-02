
const style = document.createElement("style");
style.innerHTML = `
  .db-remove {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease,
      height 0.3s ease,
      margin 0.3s ease,
      padding 0.3s ease;
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
  }

  .db-label {
    position: fixed;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
    z-index: 999999;
    font-family: Arial, sans-serif;
    pointer-events: none;
  }
`;
document.head.appendChild(style);


function animateRemove(el) {
  if (!el) return;
  el.classList.add("db-remove");
  setTimeout(() => el.remove(), 300);
}


chrome.storage.local.get(["blocked"], (res) => {
  const blocked = res.blocked || [];
  blocked.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) el.remove(); // instant on reload
  });
});


function removeSidebar() {
  animateRemove(document.querySelector("#guide"));
}

function removeComments() {
  animateRemove(document.querySelector("#comments"));
}

function removeSearch() {
  animateRemove(document.querySelector("ytd-searchbox"));
}

function saveSelector(selector) {
  chrome.storage.local.get(["blocked"], (res) => {
    const blocked = res.blocked || [];
    if (!blocked.includes(selector)) {
      blocked.push(selector);
      chrome.storage.local.set({ blocked });
    }
  });
}

function getSelector(el) {
  if (el.id) return `#${el.id}`;
  if (el.className)
    return (
      el.tagName.toLowerCase() +
      "." +
      el.className.split(" ").join(".")
    );
  return el.tagName.toLowerCase();
}

let pickerEnabled = false;
let lastEl = null;
let labelEl = null;

function showLabel() {
  labelEl = document.createElement("div");
  labelEl.className = "db-label";
  labelEl.innerText = "DOM Remover — anujraj";
  document.body.appendChild(labelEl);
}

function hideLabel() {
  if (labelEl) {
    labelEl.remove();
    labelEl = null;
  }
}

function enablePicker() {
  pickerEnabled = true;
  document.body.style.cursor = "crosshair";
  showLabel();
}

document.addEventListener("mouseover", (e) => {
  if (!pickerEnabled) return;
  if (lastEl) lastEl.style.outline = "";
  lastEl = e.target;
  e.target.style.outline = "2px solid red";
});

document.addEventListener(
  "click",
  (e) => {
    if (!pickerEnabled) return;

    e.preventDefault();
    e.stopPropagation();

    const selector = getSelector(e.target);
    saveSelector(selector);
    animateRemove(e.target);

    pickerEnabled = false;
    document.body.style.cursor = "default";
    hideLabel();
    if (lastEl) lastEl.style.outline = "";
  },
  true
);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "REMOVE_SIDEBAR") removeSidebar();
  if (msg.action === "REMOVE_COMMENTS") removeComments();
  if (msg.action === "REMOVE_SEARCH") removeSearch();
  if (msg.action === "ENABLE_PICKER") enablePicker();
});
