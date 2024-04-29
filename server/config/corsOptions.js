const { baseURL } = require('../constants');

const corsOptions = {
  origin: `${baseURL.client}`,
  credentials: true,
};

module.exports = corsOptions;
