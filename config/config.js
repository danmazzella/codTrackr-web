module.exports = {
  production: {
    api: {
      url: 'http://api.ocaclan.com',
    },
    socket: {
      url: 'http://socket.ocaclan.com',
    },
  },
  dev: {
    api: {
      url: 'http://localhost:8081',
    },
    socket: {
      url: 'http://localhost:4747',
    },
  },
};
