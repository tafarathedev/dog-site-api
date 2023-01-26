import express from 'express'
import adminAuth from '../../middleware/adminAuth.js'
const router = express.Router()
import {sendWelcomeEmail} from '../../email/account.js'
import sharp from 'sharp' 
import multer from 'multer'
import AdminUser from '../../models/Admin/AdminModel.js'



//create user account
router.post("/admin/create", async(req,res)=>{
    const { email , password , firstName , lastName , agree} = req.body
  try {
    const admin = new AdminUser({email, password , firstName, lastName , agree })
    const token = await admin.setAdminAuthToken()
    sendWelcomeEmail(admin.email )
    const saveAdmin = await admin.save()
    res.cookie("adminAuthCookies" , token ,{
      secure:true,
      httpOnly:true,
      maxAge:90000  
    })
    .status(200)
    .json({
      success:true,
      admin:saveAdmin,
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
    const admin = await AdminUser.findByCredentials(email,password);
    const token = await admin.setAdminAuthToken()
    await admin.save()
    res.cookie("adminAuthCookies" , {
      secure:true,
      httpOnly:true,
      maxAge:90000
      
    }).json({success:true, admin , message:"Logged in Successfully", token});
} catch (e) {
    res.status(400).send({
      success:false,
      error:e.message
    });
}
}) 


//logout from current mobile
router.post('/logout', adminAuth, async (req, res) => {
   
   try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.user.save()
        console.log(req.user.tokens)
    res.cookie("adminAuthCookies", {
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
router.post('/me/logoutAll', adminAuth, async (req, res) => {
  try {
      req.user.tokens = []
      await req.user.save()
      res.send()
  } catch (e) {
      res.status(500).send()
  }
})
//view personal account
router.get("/me/profile",adminAuth, async(req, res) => {
  
  try {
      const user = await AdminUser.findOne({id:req.user.id})   
    
  } catch (e) {
      res.status(402).json(e.message)
  }
})
//delete your personal account
router.delete("delete/me",adminAuth ,async(req,res)=>{
   const admin = req.user.remove()
   try {
      await admin.save()
     res.status(200).json({
      message:"account deleted successfully",
      admin
     })
    
   } catch (error) {
    
   }
})

 //uqpdate personal account information
 
router.patch('/me/upload', adminAuth, async (req, res) => {
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
router.post('/users/me/avatar', adminAuth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

 //delete profile picture
router.delete('/users/me/avatar', adminAuth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

//view profile picture
router.get('/users/:id/avatar', async (req, res) => {
  try {
      const admin = await AdminUser.findById(req.params.id)

      if (!admin || !admin.avatar) {
          throw new Error()
      }

      res.set('Content-Type', 'image/png')
      res.send(admin.avatar)
  } catch (e) {
      res.status(404).send()
  }
})


})


// more user controls here

export default router