import { stringify } from 'jsan';
import socketCluster from 'socketcluster-client';
import socketOptions from '../constants/socketOptions';

let socket;
let channel;
const instancesConn = {};

export function addInstance(id, instanceId) {
  if (!instancesConn[instanceId]) instancesConn[instanceId] = id;
}

export function deleteInstance(id, cb) {
  Object.keys(instancesConn).some(instance => {
    if (instancesConn[instance] === id) {
      delete instancesConn[instance];
      cb(instance);
      return true;
    }
  });
}

export function dispatchRemotely(type, action, id, state) {
  socket.emit(
    id ? 'sc-' + instancesConn[id] : 'respond',
    { type, action, state }
  );
}

export function dispatchSync(state, id) {
  socket.emit(
    'respond',
    {
      type: 'SYNC',
      id: instancesConn[id],
      instanceId: id,
      state: stringify(state)
    }
  );
}

export function subscribe(subscriber, options = socketOptions, onInstancesChanged) {
  if (channel) channel.unwatch();
  if (socket) socket.disconnect();
  try {
    socket = socketCluster.connect(options);
  } catch (error) {
    // FIXME: show in a dialog component
    /* eslint-disable no-alert */
    alert(error.message);
    /* eslint-enable */
    return false;
  }

  function watch(req) {
    let data;
    if (req.data) {
      data = req.data;
      data.id = req.id;
    } else data = req;

    if (data.type === 'DISCONNECTED') {
      onInstancesChanged({ id: req.id }, undefined, true);
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
      dispatchRemotely('START');
    });
  });
}
