/**
 * Vercel Serverless Function Entrypoint (/api/index.js)
 *
 * Routes all incoming HTTP requests on Vercel to our application server handler.
 */

const server = require('../src/server');

module.exports = (req, res) => {
  server.emit('request', req, res);
};
