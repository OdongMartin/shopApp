const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const userInfo = require('../models/userInfoDB');

const Product = require('../models/productDB');

//homepage -- /shop/ ......should display items
router.get('/', (req, res)=>{
    /*Product.find().then((productData)=>{
        console.log(productData);
        //res.render('home', {products: productData});
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })*/
    //console.log("shop home boys");
    userInfo.findOne({username: "om"}).then((user)=>{
            //console.log("user: "+ user.username + " id: " + user._id)
            console.log(user._id);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal Server Error');
    });

});

//create products
router.get('/product/create', (req, res)=>{
    res.render('create-product');
})
router.post('/product/create', (req, res)=>{
    var newProduct = new Product({
        name: req.body.title,
        description: req.body.description,
        currency: req.body.currency,
        price: req.body.price,
        //quantity: "3",
        //category: "shoes",
        //image: { type: String, data: Buffer },
    });

    newProduct.save()
    .then(()=>{
        res.redirect('/shop')
    })
    .catch((err)=>{
        res.send("error saving user to database");
    })

    /*newProduct.save(function(err, task) {
        if(err){
            res.send("error saving user to database");
        }
        else {
            res.redirect('/');
        }
    });*/
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