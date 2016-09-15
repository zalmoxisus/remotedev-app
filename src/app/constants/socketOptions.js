const socketOptions = {
  hostname: 'remotedev.io',
  port: 80,
  autoReconnect: true,
  secure: false,
  autoReconnectOptions: {
    randomness: 30000
  }
};

export default socketOptions;
