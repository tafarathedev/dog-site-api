import express from  'express'
//use express router  
const router = express.Router()
// import user model 
import Product from '../models/ProductModel.js'
import adminAuth from '../middleware/adminAuth.js'



//post router for dog products 
router.post("/products",adminAuth, async(req,res)=>{
  try {
    const product = new Product({...req.body , owner:req.admin._id})
    
     await product.save()

     res
    .status(200).cookie("postCookies", req.admin.token ,{
      secure:true,
      httpOnly:true,
      maxAge:1000 * 60 * 60 * 24
    }).redirect("/site/view_product")
       
  } catch (error) {
   
     res.status(400).json({
      success:false,
      message:error.message
     })
  }
    
})


//view all products 
 router.get("/products" , async(req,res)=>{
    const product =  await Product.find({})
     //validate 
     try {
           if(!product){
            return res.json("problem in try state")
           }
           res.status(200).json({message:"fetched!...",product,success:true})
     } catch (error) {
         return res.json(error.message)
     }
 })

 export default  router