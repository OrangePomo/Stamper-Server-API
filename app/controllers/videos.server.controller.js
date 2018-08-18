const Video = require('mongoose').model('Video');

exports.upload = (req, res, next) => {
  const video = new Video(req.body);
  video.save(err => {
    if(err) next(err);
    res.json(video);
  });
};

exports.videoByID = (req, res, next, id) => {
  Video.findById(id, (err, video) => {
    if(err) return next(err);
    if(!video) req.video = null;
    else req.video = video;
    next();
  });
};
