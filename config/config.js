module.exports = {
  production: {
    api: {
      url: 'http://ocatrackr-api.themazzellas.com',
    },
    socket: {
      url: 'http://ocatrackr-socket.themazzellas.com',
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
