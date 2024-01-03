const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

//prodcut database
const storeSchema = mongoose.Schema({
    ownerId : { type: String, required: true },
    name: { type: String, required: true },
    category: {type: String, required: true},
    description: { type: String, required: true },
    imagePath1: { type: String, required: true}, //image for Profile picture
    imagePath2: { type: String, required: true}, //image for banner image
    timeCreated: { type: Date, default: Date.now },
});

const store = mongoose.model('store', storeSchema);

module.exports = store;