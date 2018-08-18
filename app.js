process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express_config');
const mongoose = require('./config/mongoose');
const config = require('./config/config');

mongoose();

const app = express();
app.listen(config.SERVER_PORT, () => {
  console.log("Server is running on %d port", config.SERVER_PORT);
});

module.exports = app;
