chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('index.html', {
    'state': 'normal'
  });
});
