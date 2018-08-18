const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  _id : {
    type : String
  },
  uid : {
    type : String,
    ref : 'User',
    required : 'User is required'
  },
  videoUrl : {
    type : String,
    required : 'videoUrl is required'
  },
  thumbnailUrl : {
    type : String,
    required : 'thumbnailUrl is required'
  },
  like : {
    type : Number,
    default : 0
  },
  geometry : [{
    type : Number
  }],
  created : {
    type : Date,
    default : Date.now
  }
}, {
  versionKey : false,
  usePushEach: true
});

mongoose.model('Video', VideoSchema);
