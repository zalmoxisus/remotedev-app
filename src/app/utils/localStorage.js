import localStorage from 'chrome-storage-local';

export function getFromStorage(key) {
  if (localStorage.isChromeStorage) return null;
  return localStorage.getItem(key);
}

export function saveToStorage(key, value) {
  let sValue = value;
  if (typeof value === 'object' && !localStorage.isChromeStorage) {
    sValue = JSON.stringify(value);
  }
  localStorage.setItem(key, sValue);
  return value;
}

export function saveObjToStorage(remove, keys, values) {
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

export function getSettings() {
  if (!localStorage.isChromeStorage) {
    const hostname = localStorage.getItem('s:hostname');
    const port = localStorage.getItem('s:port');
    let secure = localStorage.getItem('s:secure');
    secure = secure === 'true';
    if (hostname && port) return { hostname, port: Number(port), secure };
  }
  return null;
}
