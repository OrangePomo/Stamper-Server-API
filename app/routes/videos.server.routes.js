const videos = require('../../app/controllers/videos.server.controller');

module.exports = app => {
  app.route('/videos')
    .post(videos.upload);

  app.param('videoId', videos.videoByID);  //app.route보다 먼저 실행됨
};
