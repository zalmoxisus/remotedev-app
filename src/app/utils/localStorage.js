import localStorage from 'chrome-storage-local';

export function getSettings() {
  if (!localStorage.isChromeStorage) {
    const hostname = localStorage.getItem('s:hostname');
    const port = localStorage.getItem('s:port');
    if (hostname && port) return { hostname, port: Number(port) };
  }
  return null;
}

export function saveToStorage(remove, keys, values) {
  if (remove) {
    keys.forEach(key => {
      localStorage.removeItem('s:' + key);
    });
    return null;
  }

  let obj = {};
  keys.forEach(key => {
    localStorage.setItem('s:' + key, values[key]);
    obj[key] = values[key];
  });
  return obj;
}
