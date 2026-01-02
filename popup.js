function send(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action });
  });
}

document.getElementById("sidebar").onclick = () =>
  send("REMOVE_SIDEBAR");

document.getElementById("comments").onclick = () =>
  send("REMOVE_COMMENTS");

document.getElementById("search").onclick = () =>
  send("REMOVE_SEARCH");

document.getElementById("pick").onclick = () =>
  send("ENABLE_PICKER");
