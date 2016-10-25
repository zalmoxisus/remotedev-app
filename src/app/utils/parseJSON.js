import jsan from 'jsan';

export default function parseJSON(data, serialize) {
  if (typeof data !== 'string') return data;
  try {
    if (serialize === true) return jsan.parse(data);
    return JSON.parse(data);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error(data + 'is not a valid JSON', e);
    return undefined;
  }
}
