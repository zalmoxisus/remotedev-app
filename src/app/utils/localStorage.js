import localStorage from 'chrome-storage-local';

export function getFromStorage(key) {
  if (localStorage.isChromeStorage) return null;
  return localStorage.getItem(key);
}

export function saveToStorage(key, value, remove) {
  if (remove) {
    localStorage.removeItem(key);
    return null;
  }

  let sValue = value;
  if (typeof value === 'object' && !localStorage.isChromeStorage) {
    sValue = JSON.stringify(value);
  }
  localStorage.setItem(key, sValue);
  return value;
}

export function saveObjToStorage(remove, obj) {
  if (remove) {
    Object.keys(obj).forEach(key => {
      localStorage.removeItem('s:' + key);
    });
    return null;
  }

  Object.keys(obj).forEach(key => {
    localStorage.setItem('s:' + key, obj[key]);
    obj[key] = obj[key];
  });
  return obj;
}

export function getSocketSettings() {
  if (localStorage.isChromeStorage) return undefined;
  const hostname = localStorage.getItem('s:hostname');
  const port = localStorage.getItem('s:port');
  let secure = localStorage.getItem('s:secure');
  secure = secure === 'true';
  if (hostname && port) return { hostname, port: Number(port), secure };
}

export function getMonitorSettings() {
  if (localStorage.isChromeStorage) return undefined;
  return {
    selected: localStorage.getItem('monitor') || 'InspectorMonitor',
    sliderIsOpen: localStorage.getItem('slider') === 'true',
    dispatcherIsOpen: localStorage.getItem('dispatcher') === 'true'
  };
}

export function getTestTemplates() {
  const templates = getFromStorage('test-templates');
  return templates && JSON.parse(templates);
}

export function getTemplatesSelected() {
  return Number(getFromStorage('test-templates-sel')) || 0;
}
