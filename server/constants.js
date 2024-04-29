const path = require('path');
const rootDir = path.dirname(require.main.filename);

const baseURL = {
  client: 'http://localhost:3000',
  server: 'http://localhost:3080',
};

module.exports = { baseURL, rootDir };
