const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const userInfo = require('../models/userInfoDB');
const Product = require('../models/productDB');
const cart = require('../models/cartDB');

const upload = require('../middleware/upload');
const isAuthenticated = require('../middleware/authMiddleware');

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
/*function Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/auth/login');
}*/

//delete entire product DB
/*router.get('/productsDB/delete', function(req, res) {
    Product.deleteMany().then(()=>{
        console.log ("removed all data in products");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })
});

//delete entire cart DB
router.get('/cartDB/delete', function(req, res) {
    cart.deleteMany().then(()=>{
        console.log ("removed all data in cart");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })
});*/

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
router.get('/:userId/products/create', isAuthenticated, (req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    res.render('create-product', {userId: req.params.userId});
})
router.post('/:userId/products/create', upload.single('image'), async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    try {
        //Check if there were errors related to file size
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

// Shopping Cart

router.get('/:userId/cart', isAuthenticated, (req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    /*cart.find()
    .then((productCart)=>{
        console.log("cart " + productCart)
    })*/
    var myCart = [];
    cart.find({ownerId: req.params.userId})
    .then((productCart)=>{
        for (let i = 0; i < productCart.length; i++){
            myCart.push(productCart[i].productId); //add IDs to myCArt array
        }

        //get prodcts from myCart array and display them
        Product.find({ _id: { $in: myCart } }).then((productData)=>{
            res.render('cart', { products: productData, userId: req.params.userId }); //should be person's profile
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});
router.post('/:userId/cart/add/:productId', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    try {
        //Check if the product is already in the cart
        const existingCartItem = await cart.findOne({ ownerId: req.params.userId, productId: req.params.productId });

        if (existingCartItem) {
            //Product is already in the cart
            return res.status(400).send('Product is already in the cart');
        }

        else{
            const newItem = new cart({
                ownerId: req.params.userId,
                productId: req.params.productId,
            });
    
            await newItem.save()
            .then(()=>{
                res.redirect( "/shop/" + req.params.userId + "/cart")
            })
            .catch((err)=>{
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
        }        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
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

//homepage -- /shop/ ......should display items
router.get('/', (req, res)=>{
    //console.log("is authenticated "+ req.isAuthenticated())
    //console.log("username "+ req.user);
    Product.find().then((productData)=>{
        //console.log(productData);
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        res.render('home', { products: productData, userId: req.params.userId }); //should be person's profile
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
});
router.get('/:userId', async (req, res)=>{
    try {
        //check if userid in dtabase and valid //if no authentication needed
        if (req.params.userId === 'undefined') {
            return res.redirect('/shop');
        }

        if (!mongoose.isValidObjectId(req.params.userId)) {
            //return res.status(400).send('Invalid user ID');
            return res.redirect('/shop');
        }

        const user = await userInfo.findOne({ _id: req.params.userId });

        if (!user) {
            //return res.status(404).send('User not found');
            return res.redirect('/shop');
        }

        const productData = await Product.find();
        res.render('home', { products: productData, userId: req.params.userId });
    } catch (error) {
        console.error('Error fetching user or products:', error);
        res.status(500).send('Internal Server Error');
    }
    //stop unauthorized creation of items
    /*if(req.params.userId == "undefined"){
        return res.redirect('/shop');
    }

    //check if user is in DB
    const user = userInfo.findOne({ _id: req.params.userId });
    console.log(user)
    if (!user) {
        return res.status(404).send('User not found');
    }

    //console.log("is authenticated "+ req.isAuthenticated())
    //console.log("username "+ req.user);
    Product.find().then((productData)=>{
        //console.log(productData);
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        res.render('home', { products: productData, userId: req.params.userId }); //should be person's profile
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })*/
});

//User Product Listings

//search product
router.get('/:userId/products/search', async (req, res)=>{
    try {
        const searchTerm = req.query.q;
        const productData = await Product.find({name: { $regex: searchTerm, $options: 'i' }}) //Case-insensitive partial search
        res.render('home', { products: productData, userId: req.params.userId, searchTerm }); //should be person's profile 
    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
    }
});

router.get('/:userId/products', isAuthenticated, (req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    Product.find({ownerId: req.params.userId}).then((productData)=>{
        //console.log('productid' + productData[0]._id.toHexString()); //product id to string
        //console.log('these prods belong to personid' + req.params.userId);
        res.render('my-products', { products: productData, userId: req.params.userId }); //should be person's profile 
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

//list specific product
router.get('/:userId/products/:productId',isAuthenticated, (req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    Product.findById(req.params.productId)
    .then((productData)=>{
        res.render('product-page', { products: productData, userId: req.params.userId });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
}); 

//Function to format price with commas
function formatPriceWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = router;