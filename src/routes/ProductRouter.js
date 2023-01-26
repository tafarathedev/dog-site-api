import express from  'express'
//use express router  
const router = express.Router()
// import user model 
import Product from '../models/ProductModel.js'
import adminAuth from '../middleware/adminAuth.js'



//post router for dog products 
router.post("/products",adminAuth, async(req,res)=>{
  
    
  try {
    const product = new Product({...req.body , owner:req.user._id})
    
     await product.save()

     res.send(product)
   console.log( product )
       
  } catch (error) {
   
     res.status(400).json({
      success:false,
      message:error.message
     })
  }
    
})

 export default  router