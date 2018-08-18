const config = require('./config');
const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(config.MONGODB, {useNewUrlParser: true});
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("MongoDB connected");
    });

    require('../app/models/user.server.model.js');
    require('../app/models/video.server.model.js');

    return db;
}
