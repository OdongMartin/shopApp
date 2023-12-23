require('dotenv').config();
const PORT = process.env.PORT || 3000;
const SECRETE = process.env.SECRETE;

const express = require('express');
const app = express();

const shop = require('./routes/shop.js');
const auth = require('./routes/authentication.js');

const multer = require('multer');
const upload = multer();
//app.use(upload.array()); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static('public'));

const cors = require('cors');


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
    res.redirect('/auth');
})

app.use('/auth', auth);
app.use('/shop', shop);

app.listen(PORT, () =>{
    console.log(`listening on port 3000`)
})

