const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

//const userInfo = require('../models/userInfoDB');

const Product = require('../models/productDB');

const upload = require('../middleware/upload');

//const checkLoggedIn = require('../routes/authentication');

// Delete product route //try this later plrease
/*router.post('/products/delete/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove the associated image file
        await fs.unlink(`public${product.imagePath}`);

        // Delete the product from the database
        await product.remove();

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/
router.get('/productsDB/delete', function(req, res) {
    Product.deleteMany().then(()=>{
        console.log ("removed all data in products");
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
router.post('/:userId/products/create', upload.single('image'), async(req, res)=>{
    try {
        // Check if there were errors related to file size
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
      }
        var newProduct = new Product({
            //productId: (...).toHexString() 
            ownerId: req.params.userId,
            name: req.body.title,
            category: req.body.category,
            description: req.body.description,
            condition: req.body.condition,
            size: req.body.size,
            currency: req.body.currency,
            price: req.body.price,
            formattedPrice: formatPriceWithCommas(req.body.price),
            //hoursPosted: formatTime(Product.timePosted),
            //quantity: "3",
            //category: "shoes",
            imagePath: '/uploads/' + req.file.filename,
        });

        await newProduct.save()
        .then(()=>{
            res.redirect('/shop/'+ req.params.userId + '/products')
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send('error saving user to database');
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
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

router.get('/:userId', (req, res)=>{
    Product.find().then((productData)=>{
        console.log(productData);
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        res.render('home', { products: productData, userId: req.params.userId }); //should be person's profile
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
});

//homepage -- /shop/ ......should display items
router.get('/:userId/products', (req, res)=>{
    Product.find({ownerId: req.params.userId}).then((productData)=>{
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        //console.log('these prods belong to personid' + req.params.userId);
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

    //console.log(req.params.userId);

});

router.get('/:userId/products/search', (req, res)=>{
    const searchTerm = req.query.q;
    Product.find({name: { $regex: searchTerm, $options: 'i' }}) //Case-insensitive partial search
    .then((productData)=>{
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        //console.log('these prods belong to personid' + req.params.userId);
        res.render('home', { products: productData, userId: req.params.userId, searchTerm }); //should be person's profile 
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
});

//Function to format price with commas
function formatPriceWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
//minutes with zero before eg (15:07) // do later
/*function formatTime(time) {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
}*/


module.exports = router;