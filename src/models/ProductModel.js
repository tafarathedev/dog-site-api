import mongoose from 'mongoose'
//import validator from 'validator';
import dotenv from  'dotenv'
dotenv.config()
const productSchema = new mongoose.Schema({
     name:{
        type:String ,
        trim:true
     },
     image:{
     type:String,
     trim:true
     },
     desc:{
        type:String,
        trim:true,
        
     },
     price:{
        type:Number,
        trim:true
     },
     owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
         ref:"AdminUser"
     }
   ,
   date:{
      type:Date,
      default:new Date
   }
  
})




const Product = mongoose.model("Product" , productSchema)

export default Product