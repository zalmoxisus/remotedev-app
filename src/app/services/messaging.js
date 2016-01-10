import socketCluster from 'socketcluster-client';
import socketOptions from '../constants/socketOptions';

let socket;
let channel;

export function subscribe(subscriber) {
  socket = socketCluster.connect(socketOptions);

  socket.emit('login', {}, (err, channelName) => {
    if (err) { console.error(err); return; }
    channel = socket.subscribe(channelName);
    channel.watch(subscriber);
  });
}

export function dispatchRemotely(action) {
  socket.emit('respond', { type: 'DISPATCH', action });
}
