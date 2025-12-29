// Generic controller for YouTube and Spotify
console.log("Gym Sync Content Script Loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "TOGGLE_PLAYBACK") {
    togglePlayback();
  }
});

function togglePlayback() {
  const host = window.location.hostname;
  
  if (host.includes("youtube.com")) {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) video.play();
      else video.pause();
    }
  } else if (host.includes("spotify.com")) {
    // Spotify web player specific selectors
    const playButton = document.querySelector('[data-testid="control-button-playpause"]');
    if (playButton) {
      playButton.click();
    }
  }
}