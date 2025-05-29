// Function to send data to the server
const sendToServer = (type, data) => {
  fetch("https://clickchainapi.imhashir.me/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
  }).catch((error) => console.error("Failed to send log:", error)); // Log errors
};

// Log when the service worker starts
console.log("Background worker active");

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed or updated:", details);
  sendToServer("extension-event", { event: "installed", details });
});

// Listener for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received from content script:", { message, sender });
  sendToServer("content-message", { message, sender });
  sendResponse({ status: "Message received by background script" });
});