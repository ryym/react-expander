import jsdom from 'jsdom';

// Prepare browser global objects for React tests.

const document = jsdom.jsdom(`
  <!DOCTYPE html>
  <html>
    <body></body>
  </html>
`);
const window = document.defaultView;

Object.assign(global, {
  document, window
});

Object.keys(window).forEach(key => {
  if (! (key in global)) {
    global[key] = window[key];
  }
});
