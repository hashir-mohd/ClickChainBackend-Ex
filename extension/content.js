const sendToServer = (type, data) => {
  fetch("http://localhost:3000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
  }).catch((error) => console.error("Failed to send log:", error)); // Log errors
};

// Clicks
document.addEventListener("click", (e) => {
  console.log("Click event captured:", e.target); // Debugging log
  sendToServer("click", {
    tag: e.target.tagName,
    id: e.target.id,
    class: e.target.className,
    text: e.target.innerText,
  });
});

// Keyboard
document.addEventListener("keydown", (e) => {
  console.log("Keydown event captured:", e.key); // Debugging log
  sendToServer("keydown", {
    key: e.key,
    target: e.target.tagName,
  });
});

// JS Errors
window.onerror = (msg, url, line, col, error) => {
  sendToServer("error", {
    message: msg,
    url,
    line,
    col,
    stack: error?.stack,
  });
};

// Page info
// sendToServer("page-metadata", {
//   title: document.title,
//   url: location.href,
//   referrer: document.referrer,
//   userAgent: navigator.userAgent,
// });
