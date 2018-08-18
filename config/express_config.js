const express = require('express'),
      morgan = require('morgan'),
      compress = require('compression'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override');

module.exports = () => {
  const app = express();

  if(process.env.NODE_ENV === 'development') {
      console.log('Development Mode');
      app.use(morgan('dev'));
   } else if (process.env.NODE_ENV === 'production') {
      app.use(compress());
   }

  app.use(bodyParser.urlencoded({
    extended:true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));

  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/videos.server.routes.js')(app);

  app.use(express.static('./public'));

  require('./error_handler.js')(app);

  return app;
};
