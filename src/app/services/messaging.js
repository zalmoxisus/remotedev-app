import { stringify } from 'jsan';
import socketCluster from 'socketcluster-client';
import socketOptions from '../constants/socketOptions';

let socket;
let channel;

export function dispatchRemotely(type, action, id, bareState) {
  let state = bareState;
  if (type !== 'IMPORT') state = stringify(state);
  socket.emit(
    id ? 'sc-' + id : 'respond',
    { type, action, state }
  );
}

export function dispatchSync(state, id) {
  socket.emit(
    'respond',
    { type: 'SYNC', id, state: stringify(state) }
  );
}

export function subscribe(subscriber, options = socketOptions, onInstancesChanged) {
  if (channel) channel.unwatch();
  if (socket) socket.disconnect();
  socket = socketCluster.connect(options);

  function watch(req) {
    let data;
    if (req.data) {
      data = req.data;
      data.id = req.id;
    } else data = req;

    if (data.type === 'DISCONNECTED') {
      onInstancesChanged(req.id, undefined, true);
      return;
    }
    subscriber(data);
  }

  socket.on('error', function (err) {
    console.error(err);
  });

  socket.on('connect', function () {
    socket.emit('login', {}, (err, channelName) => {
      if (err) { console.error(err); return; }
      channel = socket.subscribe(channelName);
      channel.watch(watch);
      dispatchRemotely('UPDATE');
    });
  });
}
