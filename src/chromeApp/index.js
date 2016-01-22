chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('index.html', {
    id: 'remotedev-window',
    innerBounds: {
      width: 800,
      height: 600
    }
  });
});
