require('dotenv').config();
const PORT = process.env.PORT || 3000;
const SECRETE = process.env.SECRETE;

const express = require('express');
const app = express();

const shop = require('./routes/shop.js');
const auth = require('./routes/authentication.js');

const userInfo = require('./models/userInfoDB');

const multer = require('multer');
const upload = multer();
//app.use(upload.array()); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const cors = require('cors');

// socket.io
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const session = require('express-session');
app.use(session({
    secret: "123456789",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // Session expiration time
}));

// Initializing Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(function(username, password, done) {
        userInfo.findOne({ 
            username: username,
        }).then(function(user){
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            
            if (!user.password) {
                return done(null, false, { message: 'Incorrect password' });
            }

            // Check the password
            bcrypt.compare(password, user.password, function(err, result) {
                if (err || !result) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                // Passwords match. return the user
                return done(null, user);
            });
        }).catch(function(err){
            console.log(err);
            return done(err);
        });
    })
);

passport.serializeUser(function(userObj, done) {
    done(null, userObj); // Serialize user ID into the session
  });
  
passport.deserializeUser(function(userObj, done) {
    // Retrieve the user from the database based on the iD
    userInfo.findOne(userObj)
        .then(function(user){
            done(null, user);
        })
        .catch(function(err){
            return done(err);
    })

});

/*function checkLoggedIn(req, res, next){
    if (req.isAuthenticated()) { 
        return res.redirect("/shop");
    }
   next();
}*/

app.set('views', 'views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/', (req, res)=>{
    res.redirect('/shop');
})

app.use('/auth', auth);
app.use('/shop', shop);

const store = require("./models/storeDB.js")
const messageDB = require("./models/messageDB.js");
const chatDB = require('./models/chatsDB.js');
const productDB = require('./models/productDB.js')

//Socket.io connection handling
io.on('connection', (socket) => {
    console.log("user joined")
    socket.on('join', async(chatId) => {
        //Associate the user's socket ID with the chat
        socket.join(chatId);
        try{
            //Retrieve and send chat history to the user
            const chatHistory = await messageDB.find({chatId: chatId});
            socket.emit('chat history', chatHistory);

            
            // const chats = await chatDB.find();
            // console.log("chats: ", chats)
            //console.log("chat hist: ", chatHistory);

        } catch(err){
            console.log(err);
        }

      });
    //Broadcast a message to all connected clients
    socket.on('message', async(data) => {
        const { chatId, message } = data;
        
        //send message after saving it to database
        io.to(chatId).emit('send_message', message);

        try {

            var newMessage = new messageDB({
                chatId: chatId,
                productId: chatId.substr(0,24),
                senderId: message.senderId,
                //receiver: chatId.substr(48,72),
                content: message.content,
            });
    
            await newMessage.save();

            // //Retrieve and send chat history to the user
            // const chatHistory = await messageDB.find({chatId: chatId});
            // socket.emit('chat history', chatHistory);

            //find and update chatDB
            // store owner ussing id
            const storeData = await store.findOne({ownerId: chatId.slice(48,72)})
            //get message data
            const messageData = await messageDB.find({chatId: chatId})
            const productData = await productDB.findById(chatId.substr(0,24))

            //message message content is empty
            if(!messageData[messageData.length-1]){
                var latest_message = 'No Messages';
                var time = Date.now();
            }
            if(messageData[messageData.length-1]){
                var latest_message = messageData[messageData.length-1].content;
                var time = messageData[messageData.length-1].timestamp;
            }
            await chatDB.findOneAndUpdate(
                {chatId: chatId},

                {$set : {
                    storeName: storeData.name,
                    productName: productData.name,
                    storeImagePath: storeData.imagePath1,
                    latestMessage: latest_message,
                    time: time
                    }
                },

                {new: true}
            )



        } catch(error){
            console.error(error);
            //res.status(500).send('Internal Server Error');
        }

    });

    //not yet used
    socket.on('user_typing', ()=>{
        socket.broadcast.emit('typing');
    })
  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
  

server.listen(PORT, () =>{
     console.log(`listening on port 3000`)
})

