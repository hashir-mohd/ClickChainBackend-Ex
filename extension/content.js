const sendToServer = (type, data) => {
  fetch("http://localhost:3000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
  });
};

// Clicks
document.addEventListener("click", (e) => {
  sendToServer("click", {
    tag: e.target.tagName,
    id: e.target.id,
    class: e.target.className,
    text: e.target.innerText,
  });
});

// Keyboard
document.addEventListener("keydown", (e) => {
  sendToServer("keydown", {
    key: e.key,
    target: e.target.tagName,
  });
});

// Scroll
// window.addEventListener("scroll", () => {
//   sendToServer("scroll", {
//     scrollY: window.scrollY,
//   });
// });

// DOM changes
// const observer = new MutationObserver((mutations) => {
//   sendToServer("dom-change", { count: mutations.length });
// });
// observer.observe(document.body, { childList: true, subtree: true });

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
sendToServer("page-metadata", {
  title: document.title,
  url: location.href,
  referrer: document.referrer,
  userAgent: navigator.userAgent,
});
