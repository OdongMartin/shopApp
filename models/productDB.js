const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

//prodcut database
const productSchema = mongoose.Schema({
    storeId : { type: String, required: true },
    ownerId : { type: String, required: true },
    name: { type: String, required: true },
    category: {type: String, required: true},
    condition: {type: String, required: true},
    size: {type: String, required: true},
    description: { type: String, required: true },
    currency: { type: String, required: true },
    price: { type: Number, required: true },
    formattedPrice:{ type: String, required: true },
    timePosted: { type: Date, default: Date.now },
    //hoursPosted: { type: Date},

    //quantity: { type: Number, default: 0 },
    imagePath: { type: String, required: true},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;