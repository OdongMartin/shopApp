const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

//const userInfo = require('../models/userInfoDB');

const Product = require('../models/productDB');

//const checkLoggedIn = require('../routes/authentication');

router.get('/productsDB/delete', function(req, res) {
    Product.deleteMany().then(()=>{
        console.log ("removed all task data");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })
});

//note: this deletes entire database
/*app.get('/delete', function(req, res) {
    userInfo.deleteMany({})
    .then(function(user) {
        console.log ("removed all data");
    })
    .catch(function(err) {
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    });
});*/

//create products
router.get('/:userId/products/create', (req, res)=>{
    res.render('create-product', {userId: req.params.userId});
})
router.post('/:userId/products/create', (req, res)=>{
    var newProduct = new Product({
        //productId: (...).toHexString() 
        ownerId: req.params.userId,
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
        res.redirect('/shop/'+ req.params.userId + '/products')
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('error saving user to database');
    })
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

router.get('/', (req, res)=>{
    Product.find().then((productData)=>{
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        res.render('home', { products: productData, userId: req.params.userId }); //should be person's profile
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
});

//homepage -- /shop/ ......should display items
router.get('/:userId/products', (req, res)=>{
    Product.find().then((productData)=>{
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        res.render('home', { products: productData, userId: req.params.userId }); //should be person's profile 
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
    //console.log("shop home boys");
    /*userInfo.find().then((user)=>{
            //console.log("user: "+ user.username + " id: " + user._id)
            console.log(user[0].id);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal Server Error');
    });*/

    console.log(req.params.userId);

});

module.exports = router;