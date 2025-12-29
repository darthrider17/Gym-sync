document.getElementById('openApp').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000' }); // Assuming local dev
});

document.getElementById('syncNow').addEventListener('click', () => {
  // Send message to background to sync
  chrome.runtime.sendMessage({ action: "PLAY_PAUSE" });
});