module.exports = (function() {
  const port = process.env.EST_PORT === undefined ? 80 : process.env.EST_PORT;
  return {
    app: {
      port: port,
      api: `http://localhost:${port}/api`,
      web: `http://localhost:${port}`,
      datetime_format: 'YYYY-MM-DD HH:mm:ss:SSSS',
      date_format: 'YYYY-MM-DD'
    },
    db: {
      url: '',
      name: ''
    }
  }
})();
