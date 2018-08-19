const Video = require('mongoose').model('Video');
const User = require('mongoose').model('User');
const fs = require('fs');
const ThumbnailGenerator = require('video-thumbnail-generator').default;
const config = require('../../config/config');
const HOST = 'http://52.79.250.237:';
const SIZE = '71x71';

const VIDEO_PATH = './public/vd/';
const VIDEO_URL = HOST+config.SERVER_PORT+'/';
const THUMBNAIL_PATH = './thumb/';
const THUMBNAIL_URL = HOST+config.SERVER_PORT+'/thumb/';

exports.upload = (req, res, next) => {
  if (!req.file) {
    console.log("No video received");
    return res.json({
      "result" : false
    });
  } else {
    console.log('video received');
    const video = new Video(req.body);
    const longitude = req.body.longitude+0;
    const latitude = req.body.latitude+0;
    video.geometry.unshift(longitude);
    video.geometry.unshift(latitude);
    video._id = req.file.path.split('\\')[2];
    video.videoUrl = VIDEO_URL+'vd/'+video._id;

    const tg = new ThumbnailGenerator({
      sourcePath: req.file.path,
      thumbnailPath: './public/thumb/',
      tmpDir: './public/tmp'
    });
    tg.generateOneByPercentCb(20, {
      size: SIZE
    },(err, result) => {
      if(err) return next(err);
      video.thumbnailUrl = THUMBNAIL_URL+result;
      video.save(err => {
        if(err) return next(err);
        User.updateOne({
          _id : req.body.uid
        }, {
          $addToSet: {videos : video._id}
        }, (err, result) => {
          if(err) return next(err);
          return res.json({
            "result" : true,
            "videoId" : video._id
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

exports.getVideo = (req, res, next) => {
  Video.findById(req.params.videoId)
        .populate('uid', {password : 0, salt : 0, videos : 0, likes : 0, created : 0})
        .exec((err, video) => {
          if(err) return next(err);
          const lat1 = req.params.latitude*1;
          const lon1 = req.params.longitude*1;
          const lat2 = video.geometry[1];
          const lon2 = video.geometry[0];
          const dist = distance(lat1,lon1,lat2,lon2);
          return res.json({
            "video" : video,
            "distance" : dist
          });
        });
};

function distance(lat1, lon1, lat2, lon2) {
	let radlat1 = Math.PI * lat1/180
	let radlat2 = Math.PI * lat2/180
	let theta = lon1-lon2
	let radtheta = Math.PI * theta/180
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	return dist
}

exports.getVideoList = (req, res, next) => {
  Video.find({})
      .select({
        uid : 0, videoUrl : 0, like : 0, created : 0
      })
      .sort({created : -1})
      .exec((err, videos) => {
        if(err) return  next(err);
        return res.json(videos);
      });
};

exports.getVideoAll= (req, res, next) => {
  Video.find({})
    .populate('uid')
    .exec((err, videos) => {
      if(err) return next(err);
      return res.json(videos);
    });
};

exports.addLike = (req, res, next) => {
  Video.findById(req.params.videoId)
      .exec((err, video) => {
        if(err) return next(err);
        video.like = video.like + 1;
        video.save(err => {
          if(err) return next(err);
          return res.json(video.like);
        });
      });
};

exports.deleteAll = (req, res, next) => {
  Video.remove({}, err => {
    if(err) return next(err);
    res.json({
      "result" : true,
      "message" : "delete all videos"
    });
  });
};
