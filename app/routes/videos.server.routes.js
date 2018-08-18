const videos = require('../../app/controllers/videos.server.controller');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/vd/')
  },
  filename: (req, file, cb) => {
  crypto.pseudoRandomBytes(16, (err, raw) => {
    if (err) return cb(err);
    cb(null, raw.toString('hex') + path.extname(file.originalname));
  });
  }
});

const upload = multer({ storage: storage });

module.exports = app => {
  app.route('/video')
    .post(upload.single('videoFile'), videos.upload);

  app.route('/video/:videoId')
    .put(videos.addLike);

  app.route('/video/info/:videoId/:longitude/:latitude')
    .get(videos.getVideo);

  app.route('/video/straming/:videoId')
    .get(videos.streaming);

  app.route('/video/:longitude/:latitude/:distance')
    .get(videos.getVideoList);
};
