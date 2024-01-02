const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const userInfo = require('../models/userInfoDB');
const Product = require('../models/productDB');
const cart = require('../models/cartDB');
const store = require('../models/storeDB');
const messageDB = require('../models/messageDB');
const chatDB = require("../models/chatsDB");

const upload = require('../middleware/upload');
const isAuthenticated = require('../middleware/authMiddleware');
const chats = require('../models/chatsDB');

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

//delete entire DB expect usrDB
/*router.get('/DB/delete', function(req, res) {
    Product.deleteMany().then(()=>{
        console.log ("removed all data in products");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })

    cart.deleteMany().then(()=>{
        console.log ("removed all data in cart");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })

    store.deleteMany().then(()=>{
        console.log ("removed all data in store");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })
    
    chatDB.deleteMany().then(()=>{
        console.log ("removed all data in chat");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })

    messageDB.deleteMany().then(()=>{
        console.log ("removed all data in messages");
    }).catch((err)=>{
        console.error("Error removing data:", err);
        res.status(500).send("Internal Server Error");
    })
})*/

//delete entire cart DB
router.get('/cartDB/delete', function(req, res) {
    cart.deleteMany().then(()=>{
        console.log ("removed all data in cart");
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
router.get('/:userId/myStores/:storeId/products/create', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/myStores');
    }

    try{
        //check if store exists for user
        const storeExists = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeExists){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }
        res.render('create-product', {userId: req.params.userId, storeId: req.params.storeId, loggedIn:req.isAuthenticated()});
    } catch(err){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.post('/:userId/myStores/:storeId/products/create', isAuthenticated, upload.single('image'), async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    try {
        //Check if there were errors related to file size
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
      }
        var newProduct = new Product({
            storeId: req.params.storeId,
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
            res.redirect('/shop/'+ req.params.userId + '/myStores/'+ req.params.storeId)
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send('error saving product to database');
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
            res.render('cart', { products: productData, userId: req.params.userId, loggedIn: req.isAuthenticated() }); //should be person's profile
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
        res.render('home', { products: productData, userId: req.params.userId ,loggedIn: req.isAuthenticated()}); //should be person's profile
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

        // find all products that dont belong to user
        const productData = await Product.find({ownerId: {$ne: req.params.userId}});
        res.render('home', { products: productData, userId: req.params.userId ,loggedIn: req.isAuthenticated()});
    } catch (error) {
        console.error('Error fetching user or products:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Stores
//all stores
router.get('/:userId/stores', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }

    try{
        // const storreeeees = await store.find();
        // console.log(storreeeees);
        const storesData = await store.find({ownerId: {$ne: req.params.userId}});
        res.render('all-stores', { stores: storesData, userId: req.params.userId ,loggedIn: req.isAuthenticated()} )
        
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})
router.get('/:userId/myStores', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }

    try{
        // const storreeeees = await store.find();
        // console.log(storreeeees);
        const storesData = await store.find({ownerId: req.params.userId});
        res.render('myStores', { stores: storesData, userId: req.params.userId  ,loggedIn: req.isAuthenticated()} )
        
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})
//create store
router.get('/:userId/myStores/create', isAuthenticated, async(req, res)=>{
    res.render('create-store', {userId: req.params.userId ,loggedIn: req.isAuthenticated()})
})
router.post('/:userId/myStores/create', isAuthenticated, upload.array('images', 2), async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    try {
        //Check if there were errors related to file size
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
      }

        const images = req.files;
        const imagePath1 = '/uploads/' + images[0].filename;
        const imagePath2 = '/uploads/' + images[1].filename;

        var newStore = new store({
            ownerId: req.params.userId,
            name: req.body.title,
            category: req.body.category,
            description: req.body.description,
            imagePath1: imagePath1,
            imagePath2: imagePath2,
        });

        await newStore.save()
        res.redirect('/shop/'+ req.params.userId + '/myStores')

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.get('/:userId/myStores/:storeId', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/myStores');
    }

    try{
        //check if store exists for user
        const storeExists = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeExists){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }

        const storesData = await store.findById(req.params.storeId);
        const productData = await Product.find({storeId: req.params.storeId})
        res.render('admin-store-page', { stores: storesData, userId: req.params.userId, products:productData  ,loggedIn: req.isAuthenticated()})
        
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})
router.get('/:userId/stores/:storeId', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/stores');
    }

    try{
        //check if store exists
        const storeExists = await store.findOne({_id:req.params.storeId})
        if(!storeExists){
            return res.redirect('/shop/'+ req.params.userId + '/stores');
        }

        const storesData = await store.findById(req.params.storeId);
        const productData = await Product.find({storeId: req.params.storeId})
        res.render('store-page', { stores: storesData, userId: req.params.userId, products:productData  ,loggedIn: req.isAuthenticated()})
        
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})


//User Product Listings
//search product
router.get('/:userId/products/search', async (req, res)=>{
    try {
        const searchTerm = req.query.q;
        const productData = await Product.find({ownerId: {$ne: req.params.userId}, name: { $regex: searchTerm, $options: 'i' }}) //Case-insensitive partial search
        res.render('home', { products: productData, userId: req.params.userId, searchTerm  ,loggedIn: req.isAuthenticated()}); //should be person's profile 
    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
    }
});


//list specific product
router.get('/:userId/products/:productId',isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.productId)) { //if product id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId);
    }

    try{
        const productData = await Product.findById(req.params.productId)
        if(!productData){
            res.redirect('/shop/'+ req.params.userId) //take them to home if they change product id
        }

        const storeData = await store.findById(productData.storeId);
        //check if product belongs to user
        if(productData.ownerId === req.params.userId){
            return res.render('admin-product-page', { products: productData, userId: req.params.userId, store: storeData  ,loggedIn: req.isAuthenticated()})
        }

        return res.render('product-page', { products: productData, userId: req.params.userId, productId: req.params.productId, receiverId: productData.ownerId, store: storeData  ,loggedIn: req.isAuthenticated()});

    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}); 

router.get('/:userId/products/:productId/message/:chatId',isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.productId)) { //if product id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId);
    }

    try{
        //check if product exists
        const productData = await Product.findById(req.params.productId)
        if(!productData){
           return res.redirect('/shop/'+ req.params.userId) //take them to home if they change product id
        }

        if(!(req.params.userId === req.params.chatId.slice(24,48) || req.params.userId === req.params.chatId.slice(48,72))){
            return res.redirect('/shop/'+ req.params.userId + "/products/"+ req.params.productId);
        }

        //console.log messages
        //const messages = await messageDB.find({productId: req.params.productId, sender: req.params.userId, receiver: productData.ownerId})
        //console.log("messages" + messages);

        //check if chat already exists
        const chatExists = await chatDB.findOne({chatId: req.params.chatId});

        if(!chatExists){
            const newChat = new chatDB({
                chatId: req.params.chatId,
            })
            await newChat.save();
        }

        res.render('message', {userId: req.params.userId, chatId: req.params.chatId ,loggedIn: req.isAuthenticated() /*productId: req.params.productId, receiverId: productData.ownerId*/});
    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}); 

//list of chats
router.get('/:userId/messages', isAuthenticated, async(req, res)=>{
     if (req.params.userId != req.user._id){
         res.redirect('/auth/logout');
    }

    try{
        const chats = await chatDB.find({chatId: { $regex: req.params.userId}});
        //console.log("prod id: "+ chats )
        res.render('chats', {userId: req.params.userId, chats: chats ,loggedIn: req.isAuthenticated()});


        // if(!productData){
        //     res.redirect('/shop/'+ req.params.userId) //take them to home if they change product id
        // }
        // //console.log messages
        // const messages = await messageDB.find({productId: req.params.productId, sender: req.params.userId, receiver: productData.ownerId})
        // console.log("messages" + messages);

        // res.render('message', {userId: req.params.userId, productId: req.params.productId, receiverId: productData.ownerId });
    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}); 

//Function to format price with commas
function formatPriceWithCommas(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = router;