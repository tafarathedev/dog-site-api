import mongoose from 'mongoose'
//import validator from 'validator';
import dotenv from  'dotenv'
dotenv.config()

//mongoose schema type here
const dogSchema = new mongoose.Schema({
     name:{
        type:String ,
        trim:true
     },breed:{
      type:String,
      trim:true
     },
     image:{
     type:String,
     trim:true
     },color:{

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




const Dog = mongoose.model("Dog" , dogSchema)

export default Dog