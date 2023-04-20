const express = require('express');
const router = express.Router();
const uploader = require('../utils')

const users = ["cart"];

const reportarTiempo = (req,res,next) =>{
    console.log(`Timestamp actual: ${Date.now()}`);
    next();
}


router.get('/carts',(req,res)=>{
    res.status(200).send(users)
})




router.post('/users',uploader.single('file'),(req,res)=>{
    users.push(req.body)
    if(req.body){console.log(req.file)};
    res.status(200).send(`sent ok`)

})




module.exports = router;