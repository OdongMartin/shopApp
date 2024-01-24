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

const fs = require('fs').promises;
const path = require('path');

//delete entire DB expect usrDB
//  router.get('/DB/delete', function(req, res) {
//     Product.deleteMany().then(()=>{
//         console.log ("removed all data in products");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })

//     cart.deleteMany().then(()=>{
//         console.log ("removed all data in cart");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })

//     store.deleteMany().then(()=>{
//         console.log ("removed all data in store");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })
    
//     chatDB.deleteMany().then(()=>{
//         console.log ("removed all data in chat");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })

//     messageDB.deleteMany().then(()=>{
//         console.log ("removed all data in messages");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })
//  })

// //delete entire cart DB
// router.get('/cartDB/delete', function(req, res) {
//     cart.deleteMany().then(()=>{
//         console.log ("removed all data in cart");
//     }).catch((err)=>{
//         console.error("Error removing data:", err);
//         res.status(500).send("Internal Server Error");
//     })
// });

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
        const storeData = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeData){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }

        res.render('create-product', {userId: req.params.userId, storeId: req.params.storeId, loggedIn:req.isAuthenticated(), category: storeData.category});
    
    } catch(err){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.post('/:userId/myStores/:storeId/products/create', isAuthenticated, upload.array('images', 4), async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }

    //if image not provided
    if(!req.files[1]){
        image_path2 = 'undefined'
    }
    else{
        image_path2 = '/uploads/' + req.files[1].filename;
    }
    if(!req.files[2]){
        image_path3 = 'undefined'
    }
    else{
        image_path3 = '/uploads/' + req.files[2].filename;
    }

    if(!req.files[3])
    {
        image_path4 = 'undefined'
    }
    else{
        image_path4 = '/uploads/' + req.files[3].filename;
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
            subcategory: req.body.subcategory,
            
            description: req.body.description,
            condition: req.body.condition,
            
            currency: req.body.currency,
            price: req.body.price,
        
            formattedPrice: formatPriceWithCommas(req.body.price),
            imagePath1: '/uploads/' + req.files[0].filename,
            imagePath2: image_path2,
            imagePath3: image_path3,
            imagePath4: image_path4,

            ageGroup: req.body.agegroup,
            artist: req.body.artist,
            brand: req.body.brand,
            color: req.body.color,
            compatibility: req.body.compatibility,
            design: req.body.design,
            dimensions: req.body.dimensions,
            educationalValue: req.body.educationalvalue,
            expiryDate: req.body.expirydate,
            features: req.body.features,
            flavor: req.body.flavor,
            format: req.body.format,
            genre: req.body.genre,
            healthBenefits: req.body.healthbenefits,
            ingredients: req.body.ingredients,
            material: req.body.material,
            model: req.body.model,
            occasion: req.body.occasion,
            petType: req.body.pettype,
            publisher: req.body.publisher,
            size: req.body.size,
            skinType: req.body.skintype,
            specifications: req.body.specifications,
            sportsType: req.body.sportstype,
            type: req.body.type,
            usageInstructions: req.body.usageinstructions,
            warranty: req.body.warranty,
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
            //no products in cart
            if(!productData[0]){
                return res.render('cart', { userId: req.params.userId, loggedIn: req.isAuthenticated(), current:"cart" });
            }

            return res.render('cart', { products: productData, userId: req.params.userId, /*receiverId: productData.ownerId,*/ loggedIn: req.isAuthenticated(), current:"cart" }); //should be person's profile
        
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

//homepage -- /shop/ ......should display items
router.get('/', (req, res)=>{
    Product.find().then((productData)=>{
        console.log(productData);
        //no products yet
        if(!productData[0]){
            return res.render('home', {loggedIn: req.isAuthenticated(), current:"home"}); //should be person's profile
        }

        return res.render('home', { products: productData ,loggedIn: req.isAuthenticated(), current:"home"}); //should be person's profile
    
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
        //check if no products 
        if(!productData[0]){
            return res.render('home', { userId: req.params.userId ,loggedIn: req.isAuthenticated(), current:"home"}); //should be person's profile
        }

        return res.render('home', { products: productData, userId: req.params.userId ,loggedIn: req.isAuthenticated(), current:"home"});

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

        //no store data so display create stores info or some else
        if(!storesData[0]){
            return res.render('all-stores', { userId: req.params.userId ,loggedIn: req.isAuthenticated(), current:"stores"} )
        }

        res.render('all-stores', { stores: storesData, userId: req.params.userId ,loggedIn: req.isAuthenticated(), current:"stores"} )
        
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

        //no store data so display create stores info or some else
        if(!storesData[0]){
            return res.render('myStores', { userId: req.params.userId  ,loggedIn: req.isAuthenticated()} )
        }

        return res.render('myStores', { stores: storesData, userId: req.params.userId  ,loggedIn: req.isAuthenticated()} )
        
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

//edit store
router.get('/:userId/myStores/:storeId/edit', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/myStores');
    }

    try{
        //check if store exists for user
        const storeData = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeData){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }

        return res.render('edit-store', {store: storeData, userId: req.params.userId ,loggedIn: req.isAuthenticated()});
               
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})
router.post('/:userId/myStores/:storeId/edit', isAuthenticated, upload.array('images', 2), async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/myStores');
    }

    try{
        //check if store exists for user
        const storeData = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeData){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }    

        //console.log(req.files[1].id);

        //if image not provided
        if(!req.files[0]){
            image_path1 = storeData.imagePath1
        }
        else{
            image_path1 = '/uploads/' + req.files[0].filename;


            //delete old image
            const fullPath = path.join('public', storeData.imagePath1);
            await fs.unlink(fullPath);
        }

        if(!req.files[1]){
            image_path2 = storeData.imagePath2
        }
        else{
            image_path2 = '/uploads/' + req.files[1].filename;
            //delete old image
            const fullPath = path.join('public', storeData.imagePath2);
            await fs.unlink(fullPath);
        }
        //same as above
        // const image_path1 = req.files[0] ? '/uploads/' + req.files[0].filename : storeData.imagePath1;
        // const image_path2 = req.files[1] ? '/uploads/' + req.files[1].filename : storeData.imagePath2;
        
        //Update store information
        const updatedStore = await store.findOneAndUpdate(
            { ownerId: req.params.userId, _id: req.params.storeId },
            {
                $set: {
                    ownerId: req.params.userId,
                    name: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    imagePath1: image_path1,
                    imagePath2: image_path2,
                },
            },
            { new: true } //Return the updated document
        );

        return res.redirect('/shop/'+ req.params.userId + '/myStores/' + req.params.storeId);
               
    } catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})

//delete store
router.post('/:userId/myStores/:storeId/delete', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.storeId)) { //if store id is not valid
        //return res.status(400).send('Invalid user ID');
        return res.redirect('/shop/'+ req.params.userId + '/myStores');
    }

    try{
        //check if store exists for user
        const storeData = await store.findOne({ownerId: req.params.userId, _id:req.params.storeId})
        if(!storeData){
            return res.redirect('/shop/'+ req.params.userId + '/myStores');
        }

        //delete stor
        await store.deleteOne({_id : req.params.storeId})

        //find products that belong to that store
        const products = await Product.find({ storeId: req.params.storeId });

        //delete each product and its associated images
        for (const product of products) {
            //Delete product images
            const productImagePaths = [
                product.imagePath1,
                product.imagePath2,
                product.imagePath3,
                product.imagePath4,
            ];

            for (const imagePath of productImagePaths) {
                if (imagePath !== 'undefined') {
                    const fullPath = path.join('public', imagePath);
                    await fs.unlink(fullPath);
                }
            }

            // Delete the product
            await Product.deleteOne({ _id: product._id });
        }


        if (storeData) {
            const imagePaths = [
                storeData.imagePath1,
                storeData.imagePath2,
            ]

            for (const imagePath of imagePaths) {
                if (imagePath) {

                    if(imagePath !== 'undefined'){
                        const fullPath = path.join('public', imagePath);
                        await fs.unlink(fullPath);
                    }
                }
            }
        }

        return res.redirect('/shop/'+ req.params.userId + '/myStores');
                
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
        
        if(!productData[0]){
            res.render('home', {userId: req.params.userId, searchTerm  ,loggedIn: req.isAuthenticated()});
        }
        
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

// const fs = require('fs').promises;
// const path = require('path');
//delete product
router.post('/:userId/products/:productId/delete',isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.productId)) { //if product id is not valid
        return res.redirect('/shop/'+ req.params.userId);
    }

    try{
        const product = await Product.findById(req.params.productId);

        await Product.deleteOne({_id: req.params.productId});

        //fetch all product images and delete them
        if (product) {
            const imagePaths = [
                product.imagePath1,
                product.imagePath2,
                product.imagePath3,
                product.imagePath4,
            ];

            for (const imagePath of imagePaths) {
                if (imagePath) {

                    if(imagePath != 'undefined'){
                        const fullPath = path.join('public', imagePath);
                        await fs.unlink(fullPath);
                    }
                }
            }
        }

        res.redirect('/shop/' + req.params.userId + '/myStores');

    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:userId/products/:productId/message/:chatId',isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        res.redirect('/auth/logout');
    }
    if (!mongoose.isValidObjectId(req.params.productId)) {//if product id is not valid
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
        const chat = await chatDB.findOne({chatId: req.params.chatId});

        // store owner ussing id
        const storeData = await store.findOne({ownerId: req.params.chatId.slice(48,72)})
        //get message data
        const messageData = await messageDB.find({chatId: req.params.chatId})

        //message message content is empty
        if(!messageData[messageData.length-1]){
            latest_message = 'No Messages';
            time = Date.now();
        }
        if(messageData[messageData.length-1]){
            latest_message = messageData[messageData.length-1].content;
            time = messageData[messageData.length-1].timestamp;
        }
        
        if(!chat){
            const newChat = new chatDB({
                chatId: req.params.chatId,
                storeName: storeData.name,
                productName: productData.name,
                storeImagePath: storeData.imagePath1,
                latestMessage: latest_message,
                time: time,
            })
            await newChat.save();
        }

        res.render('message', {userId: req.params.userId, chatId: req.params.chatId, chat: chat ,loggedIn: req.isAuthenticated() /*productId: req.params.productId, receiverId: productData.ownerId*/});
    
    } catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}); 

//list of chats
router.get('/:userId/messages', isAuthenticated, async(req, res)=>{
    if (req.params.userId != req.user._id){
        //console.log("yoooooooooo")
        res.redirect('/auth/logout');
    }

    try{
        const chats = await chatDB.find({chatId: { $regex: req.params.userId}});
        //do chats exixst
        if(!chats[0]){
            return res.render('chats', {userId: req.params.userId, loggedIn: req.isAuthenticated(), current:"messages"});
        }
  
        return res.render('chats', {userId: req.params.userId, chats: chats ,loggedIn: req.isAuthenticated(), current:"messages"});

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