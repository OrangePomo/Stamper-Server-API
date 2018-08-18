const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id : {
    type : String,
    trim : true
  },
  email : {
    type : String,
    trim : true
  },
  name : {
    type : String,
    trim : true
  },
  created : {
    type : Date,
    default : Date.now
  }
}, {
  versionKey : false,
  usePushEach : true
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

UserSchema.path('email').validate(email => emailRegex.test(email), 'Please fill a valid email address');

mongoose.model('User', UserSchema);
