import mongoose from 'mongoose'
import validator from 'validator';
import bcrypt from 'bcryptjs'
import jwt from  'jsonwebtoken'
import dotenv from  'dotenv'
dotenv.config()
const userSchema = new mongoose.Schema({
    firstName:{
       type:String,
       trim:true       

    },lastName:{
        type:String,
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
    email:{
        type:String,
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
//user login 
userSchema.statics.findByCredentials = async(email ,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("check your email address")
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        throw new Error("Please provide correct password")
    }
    return user
}

//generate AuthToken
userSchema.methods.setAuthToken = async function () {
    
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

userSchema.pre("save" ,async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
    }
    next()
})

const User = mongoose.model("User" , userSchema)

export default User