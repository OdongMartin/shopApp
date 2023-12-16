const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
//prodcut db
const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String },
    image: { type: String, data: Buffer }, // Base64-encoded image data
});

const Product = mongoose.model('Product', productSchema);

//homepage -- /shop/
router.get('/', (req, res)=>{
    Product.find({}).then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    })
    console.log('home');
})

//create products
router.get('/product/create', (req, res)=>{
    console.log('create proucts');
})
router.post('/product/create', (req, res)=>{
    var newProduct = new Product({
        name: "shpes",
        description: "good shoes",
        price: "1 usd",
        quantity: "3",
        category: "shoes",
        //image: { type: String, data: Buffer },
    });

        newProduct.save(function(err, task) {
            if(err){
                res.send("error saving user to database");
            }
            else {
                res.redirect('/tasks/' + req.user.username);
            }
        });
        /*task.find(function(err, response) {
            console.log(response);
        });*/
});


router.get('/sell', (req, res)=>{
    console.log('sell');
})

// Product Listings
router.get('/products', /* ... */);
router.get('/products/:id', /* ... */);

// Shopping Cart
router.get('/cart', /* ... */);
router.post('/cart/add/:id', /* ... */);
router.post('/cart/remove/:id', /* ... */);

// Checkout
router.get('/checkout', /* ... */);
router.post('/checkout/process', /* ... */);

// User Profile
router.get('/profile', /* ... */);
router.get('/orders', /* ... */);

// Admin
router.get('/admin/products', /* ... */);
router.get('/admin/orders', /* ... */);

module.exports = router;