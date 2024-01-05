const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

var userDetails = mongoose.Schema({
    username: String/*{ type: String, required: true }*/,
    //email: String,
    password: String/*{ type: String, required: true }*/,

    //timeCreated: { type: Date, default: Date.now },
});

var userInfo = mongoose.model('userInfo', userDetails);

module.exports = userInfo;
