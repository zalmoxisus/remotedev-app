import socketCluster from 'socketcluster-client';
import socketOptions from '../constants/socketOptions';

let socket;
let channel;
let lastID;
let lastAType;

export function subscribe(subscriber, options = socketOptions) {
  if (channel) channel.unwatch();
  if (socket) socket.disconnect();
  socket = socketCluster.connect(options);

  socket.emit('login', {}, (err, channelName) => {
    if (err) { console.error(err); return; }
    channel = socket.subscribe(channelName);
    channel.watch(req => {
      const data = req.data || req;
      if (!req.id || req.id === lastID) subscriber(data);
      else {
        lastID = req.id;
        if (lastAType === 'INIT') subscriber(data);
        else {
          socket.emit('sc-' + lastID, { type: 'UPDATE' });
        }
      }
      lastAType = req.type;
    });
  });
}

export function dispatchRemotely(action) {
  socket.emit(
    lastID ? 'sc-' + lastID : 'respond',
    { type: 'DISPATCH', action }
  );
}
