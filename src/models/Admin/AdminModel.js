import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcryptjs'
import jwt from  'jsonwebtoken'
import dotenv from  'dotenv'
dotenv.config()
const userAdminSchema = new mongoose.Schema({
    firstName:{
       type:String,
       lowercase:true,
       trim:true       

    },lastName:{
        type:String,
        lowercase:true,
        trim:true
    },
    age:{
        type:Number,
        trim:true,
       
       
    },
    password:{
        type:String,
        
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`password can not be ${value}`)
            }
        },
        trim:true
    },
    agree:{
 type:Boolean,
 default:false
    },
    email:{
        type:String,
        lowercase:true,
        required:true,  
        unique:true,
        validate(value){
        if( !validator.isEmail(value)){
            throw new Error(`${value} is not a valid email address`)
        }
        },
        trim:true
    },
    avatar:{
      data:Buffer,
      contentType:String
    },
    tokens: [{
        token: {
            type: String,
            required: true,
            trim:true
        }
    }], 
    date:{  
        type:Date,
        default:Date.now
    }

})


///setup virtual 
userAdminSchema.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

//user login 
userAdminSchema.statics.findByCredentials = async(email ,password)=>{
    const admin_user = await AdminUser.findOne({email})
    if(!admin_user){
        throw new Error("check your email address")
    }
    const isMatch = await bcrypt.compare(password , admin_user.password)
    if(!isMatch){
        throw new Error("Please provide correct password")
    }
    return admin_user
}

//generate AuthToken
userAdminSchema.methods.setAdminAuthToken = async function () {
    
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_ADMIN_SECRET,{expiresIn:"24h"})
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

userAdminSchema.pre("save" ,async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
    }
    next()
})


// Delete user tasks when user is removed
userAdminSchema.pre('remove', async function (next) {
  
    await AdminUser.deleteMany({ owner: this._id })
    next()
 })
 

const AdminUser = mongoose.model("AdminUser" , userAdminSchema)

export default AdminUser