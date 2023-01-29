import express from  'express'
//use express router  
const router = express.Router()
// import user model 
 import Dog from '../models/DogsModels.js'
import adminAuth from '../middleware/adminAuth.js'



//post router for dog dogs 
router.post("/dogs",adminAuth, async(req,res)=>{
  try {
    const dog = new Dog({...req.body , owner:req.admin._id})
    
      await dog.save()

     res
    .status(200).cookie("dogCookies", req.admin.token ,{
      secure:true,
      httpOnly:true,
      maxAge:1000 * 60 * 60 * 24
    }).redirect("/site/view_dog")
       
  } catch (error) {
   
     res.status(400).json({
      success:false,
      message:error.message
     })
  }
    
})


//view all dogs 
 router.get("/dogs" , async(req,res)=>{
  const  limit = req.query.limit || 6
  const skip = req.query.skip || 0
  //pagination count 
  //dogs info
    const dog =   await Dog.find({}).limit(limit).skip(skip)
  
   const count =  await Dog.countDocuments()
     //validate 
     try {
         
           res.status(200).json({message:"fetched!...",dog,count, success:true})
     } catch (error) {
         return res.json(error.message)
     }
 })


 router.get("/dogs/:id" , async(req,res)=>{
 // const dog =   awaiDogfind({})
 const dog =  await Dog.findById(req.params.id)
   //validate 
   try {
         if(!dog){
          return res.json("problem in try state")
         }
         res.status(200).json({message:"fetched!...",dog,success:true})
   } catch (error) {
       return res.json(error.message)
   }
})
 export default  router