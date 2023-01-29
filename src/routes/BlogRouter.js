import express from  'express'
//use express router  
const router = express.Router()
// import user model 
 import Blog from '../models/BlogModel.js'
import adminAuth from '../middleware/adminAuth.js'



//post router for blog blogs 
router.post("/blogs",adminAuth, async(req,res)=>{
  try {
    const blog = new Blog({...req.body , owner:req.admin._id})
    
      await blog.save()

     res
    .status(200).cookie("blogCookies", req.admin.token ,{
      secure:true,
      httpOnly:true,
      maxAge:1000 * 60 * 60 * 24
    }).redirect("/site/view_blog")
       
  } catch (error) {
   
     res.status(400).json({
      success:false,
      message:error.message
     })
  }
    
})


//view all blogs 
 router.get("/blogs" , async(req,res)=>{

  //pagination count 
  //blogs info
    const blog = await Blog.find({})
  
   const count = await Blog.countDocuments()
     //validate 
     try {
         
           res.status(200).json({message:"fetched!...",blog,count, success:true})
     } catch (error) {
         return res.json(error.message)
     }
 })


 router.get("/blogs/:id" , async(req,res)=>{
 // const blog =   awaiblogfind({})
 const blog =  Blog.findById(req.params.id)
   //validate 
   try {
         if(!blog){
          return res.json("problem in try state")
         }
         res.status(200).json({message:"fetched!...",blog,success:true})
   } catch (error) {
       return res.json(error.message)
   }
})
 export default  router