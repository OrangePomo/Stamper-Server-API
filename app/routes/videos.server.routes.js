const videos = require('../../app/controllers/videos.server.controller');
const multer = require('multer');
const crypto = require('crypto');
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
    .get(videos.streaming);
};
