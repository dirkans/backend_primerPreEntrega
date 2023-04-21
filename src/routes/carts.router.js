const express = require('express');
const router = express.Router();
const uploader = require('../utils')


class CartManager{
    constructor(path){
        this.path = path;
        this.lastId = 0;
        this.arr = [];        
        }
    
refreshArray = async()=>{
    const rescate = await fs.promises.readFile(this.path,'utf-8');
    this.arr = (JSON.parse(rescate))
    for(let i=0; i<this.arr.length; i++){if(this.arr[i].id > this.lastId){this.lastId = this.arr[i].id}}
    }

addCart = async(prods)=>{
await this.refreshArray();

const newCart = 
        {
    id: ++this.lastId,
    items: [prods]

}
this.arr.push(newProduct)
const cadenaCart = JSON.stringify(this.arr);
await fs.promises.writeFile(this.path,cadenaCart)

return newProduct
}}


getCartById = async(id) => {
await this.refreshArray();
const product = this.arr.find(product => product.id === id);
if (product) {
  return(product)
} else {
  return(`ID ${id} Not found`);
}
}


addToCart = async (id) => {
await this.refreshArray();

for(let i=0;i<this.arr.length;i++){
    if(this.arr[i].id === id){
        return this.arr.lastIndexOf(this.arr[i])
    }
}

 

}




const cart = new CartManager('./carrito.json');








router.post('/',(req,res)=>{
    cart.addCart()
    res.status(200).send("ok")
})


router.get('/:cid',(req,res)=>{
    cart.getCartById(req.params.cid);
    res.status(200).send("ok")
})



router.post('/:cid/product/:pid',(req,res)=>{
    cart.addToCart(req.params.cid,req.params.pid);
    res.status(200).send("ok")
})

module.exports = router;