const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  user : {
    type : String,
    required : 'User is required'
  },
  videoUrl : {
    type : String,
    required : 'videoUrl is required'
  },
  like : {
    type : Number,
    default : 0
  },
  geometry : [{
    type : Number,
    required : 'geometry is required'
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
