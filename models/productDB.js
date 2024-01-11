const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');

//prodcut database
const productSchema = mongoose.Schema({
    storeId : { type: String, required: true },
    ownerId : { type: String, required: true },


    //brand: {type: String},
    //size: {type: String},


    formattedPrice:{ type: String, required: true },
    timePosted: { type: Date, default: Date.now },
    //hoursPosted: { type: Date},

    //images
    imagePath1: { type: String, required: true},
    imagePath2: { type: String }, //image for Profile picture
    imagePath3: { type: String },
    imagePath4: { type: String },

    //product info
    name: { type: String, required: true },
    category: {type: String, required: true},
    subcategory: {type: String, required: true},
    condition: {type: String, required: true},
    description: { type: String, required: true },
    currency: { type: String, required: true },
    price: { type: Number, required: true },



    ageGroup: {type: String},
    artist: {type: String},
    brand: {type: String},
    color: {type: String},
    compatibility: {type: String},
    design: {type: String},
    dimensions: {type: String},
    educationalValue: {type: String},
    expiryDate: {type: String},
    features: {type: String},
    flavor: {type: String},
    format: {type: String},
    genre: {type: String},
    healthBenefits: {type: String},
    ingredients: {type: String},
    material: {type: String},
    model: {type: String},
    occasion: {type: String},
    petType: {type: String},
    publisher: {type: String},
    size: {type: String},
    skinType: {type: String},
    specifications: {type: String},
    sportsType: {type: String},
    type: {type: String},
    usageInstructions: {type: String},
    warranty: {type: String},

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;