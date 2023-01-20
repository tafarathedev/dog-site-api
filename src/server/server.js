import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

 mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser:true 
}).then(res=>{
    console.log("connected to db ")
}).catch((err)=>{
 console.log(err)
})

export default mongoose