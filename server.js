require('dotenv').config();
const PORT = process.env.PORT || 3000;
const SECRETE = process.env.SECRETE;

const express = require('express');
const app = express();

const shop = require('./shop.js');

const multer = require('multer');
const upload = multer();
app.use(upload.array()); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static('public'));

const cors = require('cors');

const bcrypt = require('bcrypt');

const session = require('express-session');
app.use(session({
    secret: "123456789",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // Session expiration time
}));

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/shop_db');
var userDetails = mongoose.Schema({
    username: String,
    //email: String,
    password: String,
});

var userInfo = mongoose.model('userInfo', userDetails);

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

//authentication using passportjs
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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

function checkLoggedIn(req, res, next){
    if (req.isAuthenticated()) { 
        return res.redirect("/shop");
    }
   next();
}

app.get('/login', checkLoggedIn, function(req, res){
    userInfo.find().then(function(user){console.log(user)});
    res.render('login');
});
app.post('/login', function(req, res, next){
    passport.authenticate('local',  function(err, user, info) {
        if (err) {
            return next(err);
        }

        bcrypt.compare(req.body.password, user.password, function(err, result) {

            console.log(result);
            if (err || !result) {
                return res.render('login', { message: 'Enter correct details or just sign up' });
            }
            
            else{
                //manually establishing user sesssion
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/shop');
                });
            }

        });

    })(req, res, next);
});


//logout
app.get('/logout', function(req, res){
    req.session.destroy(function(err) {
        // Destroy the session
        res.redirect('/login');
    });
});

app.get('/signup', function(req, res){
    res.render('signup');
});
app.post('/signup', function(req, res){
    if (!/^[a-zA-Z0-9]+$/.test(req.body.id) || req.body.id.includes(' ')) {
        return res.render('signup', { message: 'Invalid username format' });
    }

    userInfo.findOne({username : req.body.id})
        .then(function(user){
            if(user){
                res.render('signup', {message : "Username Already Exists"});
            }
            else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        console.log(err);
                        return res.render('signup', { message: 'Error hashing password' });
                    }

                    if (req.body.password === req.body.confirmPassword){
                        var newUser = new userInfo ({
                            username : req.body.id.toLowerCase(),
                            password : hash
                        });

                        req.session.user = newUser;

                        newUser.save()
                            .then(function(){
                                res.redirect('/login');
                            })
                            .catch(function(error){
                                console.log(error);
                            });
                    }
                });
            
            }
        })
        .catch(function(err){
            console.log(err);
    });
});




app.get('/', (req, res)=>{
    userInfo.find()
        .then((user)=>{
            console.log(user);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal Server Error');
    });
    res.redirect('/home');
})

app.get('/home', (req, res)=>{
    res.render('login');
})


app.use('/shop', shop);

app.listen(PORT, () =>{
    console.log(`listening on port 3000`)
})

module.exports = userInfo;