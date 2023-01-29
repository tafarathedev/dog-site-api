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
    .status(200).cookie("postCookies", product ,{
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

  //params query for pagination
  
  //indexes 
/*   startIndex = (skip -1)*limit
  endIndex = skip * limit */
  //products info
    const product =  await Product.find({})
  
   const count = await Product.countDocuments()
     //validate 
     try {
         
           res.status(200).json({message:"fetched!...",product,count, success:true})
     } catch (error) {
         return res.json(error.message)
     }
 })


 router.get("/products/:id" , async(req,res)=>{
 // const product =  await Product.find({})
 const product = await Product.findById(req.params.id)
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