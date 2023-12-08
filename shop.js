const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    console.log('home');
})

router.get('/about', (req, res)=>{
    console.log('about');
})

router.get('/sell', (req, res)=>{
    console.log('sell');
})

module.exports = router;