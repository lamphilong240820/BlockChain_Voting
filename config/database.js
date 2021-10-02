//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://long:long@cluster0.s37kl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;