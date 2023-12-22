const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

//prodcut database
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    currency: { type: String, required: true },
    price: { type: Number, required: true },
    //quantity: { type: Number, default: 0 },
    //category: { type: String },
    //image: { type: String, data: Buffer }, // Base64-encoded image data
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;