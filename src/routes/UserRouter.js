import express from 'express'
import auth from '../middleware/auth.js'
const router = express.Router()
import User from '../models/UserModel.js'
import {sendWelcomeEmail} from '../email/account.js'
import sharp from 'sharp' 
import multer from 'multer'


//create user account
router.post("/create", async(req,res)=>{
    const { email , password , firstName , lastName , agree} = req.body
  try {
    const user = new User({email, password , firstName, lastName , agree})
    const token = await user.setAuthToken()
    sendWelcomeEmail(user.email , user.firstName , user.lastName )
    const saveUser = await user.save()
    res.cookie("authCookies" , token ,{
      secure:true,
      httpOnly:true,
      maxAge:90000  
    })
    .status(200)
    .json({
      success:true,
      user:saveUser,
      message:"User Account Created Successfully",
      token
    })
       
  } catch (error) {
   
     res.status(400).json({
      success:false,
      message:error.message
     })
  }
    
})

//login user
router.post("/login", async(req,res)=>{
  const {email , password} = req.body
  try {
    const user = await User.findByCredentials(email,password);
    const token = await user.setAuthToken()
    await user.save()
    res.cookie("authCookies" , {
      secure:true,
      httpOnly:true,
      maxAge:90000
      
    }).json({success:true, user , message:"Logged in Successfully", token});
} catch (e) {
    res.status(404).json(e.message);
}
}) 


//logout from current mobile
router.post('/logout', auth, async (req, res) => {
   
   try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.user.save()
        console.log(req.user.tokens)
    res.cookie("authCookies", {
      httpOnly:true,
      secure:true,
      maxAge:90000
    }).status().json({
      success:true,
     message :"Logout Successful"
    })
  } catch (e) {
      res.status(500).send()
    } 
  })
  
  //logout of all sessions 
router.post('/me/logoutAll', auth, async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send()
  } catch (e) {
      res.status(500).send()
  }
})
//view personal account
router.get("/me/profile",auth, async(req, res) => {
  
  try {
      const user = await User.findOne({id:req.user.id})   
    
  } catch (e) {
      res.status(402).json(e.message)
  }
})
//delete your personal account
router.delete("delete/me",auth ,async(req,res)=>{
   const user = req.user.remove()
   try {
      await user.save()
     res.status(200).json({
      message:"account deleted successfully",
      user
     })
    
   } catch (error) {
    
   }
})

 //uqpdate personal account information
 
router.patch('/me/upload', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['first_name','last_name', 'email', 'password' , 'age' ]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
  } catch (e) {
      res.status(400).send(e)
  }

   //uplaod profile picture here
   /* profile pic storage  */
const upload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
})
 
//post picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

 //delete profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

//view profile picture
router.get('/users/:id/avatar', async (req, res) => {
  try {
      const user = await User.findById(req.params.id)

      if (!user || !user.avatar) {
          throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(user.avatar)
  } catch (e) {
      res.status(404).send()
  }
})


})

export default router