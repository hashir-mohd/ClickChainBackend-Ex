function sendLog(payload) {
  fetch("http://localhost:3000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

chrome.devtools.network.onRequestFinished.addListener((request) => {
  request.getContent((body) => {
    const isEncrypted = body.split(/\s+/).length > 2000; // Check if body exceeds 2000 words
    const logData = {
      type: "network-request",
      data: {
        url: request.request.url,
        method: request.request.method,
        headers: request.request.headers,
        postData: request.request.postData?.text || null,
        status: request.response.status,
        statusText: request.response.statusText,
        mimeType: request.response.content.mimeType,
        responseHeaders: request.response.headers,
        responseBody: isEncrypted ? "Encrypted content" : body, // Replace if encrypted
        time: request.time,
      },
      timestamp: new Date().toISOString(),
    };

    sendLog(logData);
  });
});

chrome.devtools.inspectedWindow.eval(`
  (function() {
    const sendLog = (type, data) => {
      fetch("http://localhost:3000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString()
        })
      });
    };

    // Override console methods
    ['log', 'warn', 'error', 'info'].forEach((fn) => {
      const old = console[fn];
      console[fn] = function (...args) {
        sendLog("console-" + fn, args);
        old.apply(console, args);
      };
    });

    // JS errors
    window.onerror = function(message, source, lineno, colno, error) {
      sendLog("js-error", {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack || null,
      });
    };

    // Unhandled promise rejections
    window.onunhandledrejection = function(event) {
      sendLog("unhandled-promise-rejection", {
        reason: event.reason,
      });
    };
  })();
`);

