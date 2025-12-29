// Listen for messages from popup or web app (via external messaging if configured)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PLAY_PAUSE") {
    // Find active music tabs and toggle playback
    queryMusicTabs().then(tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_PLAYBACK" });
      });
    });
  }
});

async function queryMusicTabs() {
  // Simple heuristic to find music tabs
  const tabs = await chrome.tabs.query({});
  return tabs.filter(tab => 
    (tab.url.includes("youtube.com/watch") || tab.url.includes("open.spotify.com")) 
  );
}