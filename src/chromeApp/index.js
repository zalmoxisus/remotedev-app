chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('window.html', {
    'state': 'normal'
  });
});
