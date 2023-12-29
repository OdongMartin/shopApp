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

// server.listen(app.get(PORT, () =>{
//     console.log(`listening on port 3000`)
// }))
//Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
  
    //Broadcast a message to all connected clients
    socket.on('message', (msg) => {
        io.emit('send_message', msg);
    });

    socket.on('user_typing', (user)=>{
        socket.broadcast.emit('typing', user);
    })
  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
  

server.listen(PORT, () =>{
     console.log(`listening on port 3000`)
})

