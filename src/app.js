const express = require('express');
const router_products = require('./routes/products.router.js')
const router_carts = require('./routes/carts.router.js')
const PUERTO = 8080;
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true }));



server.use('/api/products',router_products)
server.use('/api/carts',router_carts)

server.use('/',express.static(`${__dirname}/public`));



server.listen(PUERTO,()=>{
    console.log(`Server started on port ${PUERTO}`)
})


