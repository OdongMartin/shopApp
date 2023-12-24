const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

//prodcut database
const productCart = mongoose.Schema({
    ownerId : { type: String, required: true },
    productId: { type: String, required: true },
});

const cart = mongoose.model('cart', productCart);

module.exports = cart;