const express = require('express');
const router = express.Router();
const uploader = require('../utils')
const fs = require('fs')


const validarPost =  function(body)  {
    const tempBody = body;
    if (!tempBody.title || tempBody.title == "" || !tempBody.description || tempBody.description == "" || !tempBody.price || tempBody.price == 0 || !tempBody.code || tempBody.code == "" || !tempBody.stock || tempBody.stock == 0 || !tempBody.status || tempBody.status == "" || !tempBody.category || tempBody.category == "" ) {return false} else {return true}}

    class ProductManager{
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

addProduct = async(title,description,price,code,stock,status,category,thumbnail)=>{
    await this.refreshArray();

    
    if (this.arr.length && this.arr.some(product => product.code === code)) {
        console.log("Ese código ya existe")} else {
    const newProduct = 
            {
        id: ++this.lastId,
        title:title,
        description:description,
        price:price,
        code:code,
        stock:stock,
        status:status,
        category:category,
        thumbnail:thumbnail

    }
    this.arr.push(newProduct)
    const cadenaProd = JSON.stringify(this.arr);
    await fs.promises.writeFile(this.path,cadenaProd)
    
    return newProduct
}}

 getProducts = async () => {
    await this.refreshArray();
    return this.arr
}

getProductById = async(id) => {
    await this.refreshArray();
   const product = this.arr.find(product => product.id === id);
    if (product) {
      return(product)
   } else {
      return(`ID ${id} Not found`);
    }
  }


getIndexById = async (id) => {
    await this.refreshArray();
    
    for(let i=0;i<this.arr.length;i++){
        if(this.arr[i].id === id){
            return this.arr.lastIndexOf(this.arr[i])
        }
    }
    
     
    
}
  
updateProduct = async(id,field,nuevo) => {
    await this.refreshArray();
    const product = this.arr.find(product => product.id === id);

    
if (product && nuevo!==product[field]) {
        const datoAnterior = product[field] //Se almacena el campo antes de modificarlo, para luego poder mostrar en consola cuál fue el cambio realizado.
        const indexBuscado = this.arr.indexOf(product) //Sabemos que index es el producto        
        
        product[field] = nuevo; //Se reemplaza el campo deseado por el nuevo pasado como parámetro
        
        this.arr.splice(indexBuscado,1,product) // Se reemplaza en el array original el objeto modificado
        let datosObjNewStringuiseado = JSON.stringify(this.arr); //Se convierte a string
        

        await fs.promises.writeFile(this.path,datosObjNewStringuiseado) // se escribe el nuevo JSON
    } else {
      console.log("ID no encontrado, o el valor ingresado ya es el actual");
    }
    
}

deleteProduct = async(id) => {

    await this.refreshArray();
    const product = this.arr.find(product => product.id === id);
    if(product){
    const indexBuscado = this.arr.indexOf(product) //Sabemos que index es el producto
    this.arr.splice(indexBuscado,1) //Se elimina el producto del array original
    const datosObjNewStringuiseado = JSON.stringify(this.arr); //Se convierte a string
    await fs.promises.writeFile(this.path,datosObjNewStringuiseado) //Se escribe el nuevo JSON
    console.log(`El producto ${product.title}fue eliminado correctamente`) //Mensaje informativo
    }


    else
    {console.log('Cannot delete, ID not found')}
}

}

const manager = new ProductManager('./productos.json');

//Comentados una vez agregados estos dos productos iniciales
//manager.addProduct("Nafta Super","Combustible de 96 octanos por Litro",212,"super.png","combsuper",500000);
//manager.addProduct("Nafta Premium","Combustible de 98 octanos por Litro",265,"premium.png","combpremium",500000);


manager.refreshArray();




router.get('/',async(req,res)=>{
    const prods = await manager.getProducts();
    if(!req.query.limit){
        res.status(200).send(prods)
    } else {
        const prodsLimitado = prods.slice(0,(req.query.limit))
        res.status(200).send(prodsLimitado)
    }
});


router.get('/:pid',async(req,res)=>{
    const idNum = parseInt(req.params.pid) 
    const prod = await manager.getProductById(idNum);
    res.status(200).send(prod)
    
});




router.post('/',async (req,res)=>{
    const objBody = req.body;
    if (!validarPost(objBody)) {res.status(412).send("No se completaron los campos obligatorios")} else {
    const newProd = await manager.addProduct(objBody.title,objBody.description,objBody.price,objBody.code,objBody.stock,objBody.status,objBody.category,objBody.thumbnail)
    console.log(newProd)
    res.status(200).send(newProd)
    }

})




router.put('/:id',async (req,res)=>{

const objBody = req.body;
let idBuscado = parseInt(req.params.id)

for (let i = 0; i<Object.keys(objBody).length;i++){
    async function actualizar() { 
    const paramA = Object.keys(objBody)[i].toString()
    await manager.updateProduct(idBuscado,paramA,Object.values(objBody)[i])
    }
    await actualizar()
}


res.status(200).send("ok")
})



router.delete('/:id',async(req,res)=>{
    const idBuscado = parseInt(req.params.id)
    manager.deleteProduct(idBuscado)
    res.status(200).send("Deleted ok")
})



module.exports = router;