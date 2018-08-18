const Video = require('mongoose').model('Video');
const User = require('mongoose').model('User');
const fs = require('fs');
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const config = require('../../config/config');
const HOST = 'http://localhost:';
const SIZE = '71x71';

const VIDEO_PATH = './public/vd/';
const VIDEO_URL = HOST+config.SERVER_PORT+'/vd/';
const THUMBNAIL_PATH = './public/thumb/';
const THUMBNAIL_URL = HOST+config.SERVER_PORT+'thumb/';

exports.upload = (req, res, next) => {
  if (!req.file) {
    console.log("No video received");
    return res.json({
      "result" : false
    });
  } else {
    console.log('video received');
    const video = new Video(req.body);
    video.videoUrl = VIDEO_URL+req.file.path;

    console.log('videoUrl: '+video.videoUrl);

    const tg = new ThumbnailGenerator({
      sourcePath: req.file.path,
      thumbnailPath: '../../public/thumb/',
      tmpDir: '../../public/tmp'
    });
    tg.generateOneByPercentCb(20, {
      size: SIZE
    },(err, result) => {
      if(err) return next(err);
      video.thumbnailUrl = result;
      video.save(err => {
        if(err) return next(err);
        User.update({
          _id : uid
        }, {
          $addToSet: {videos : video._id}
        }, (err, result) => {
          if(err) return next(err);
          return res.json({
            "result" : true
          });
        });
      });
    });
  }
};

exports.streaming = (req, res, next) => {
  const videoId = req.params.videoId;
  const path = VIDEO_PATH+videoId;
  const vdSplit = videoId.split('.');
  const vdType = vdSplit[vdSplit.length-1];
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/'+vdType,
    };
    console.log(head);
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/'+vdType,
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};
