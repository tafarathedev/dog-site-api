//how to implement jwt.verify method?
import jwt from 'jsonwebtoken'
import dotenv from  'dotenv'
import User from '../models/UserModel.js'
dotenv.config()

    
  

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.authCookies
        const decoded = jwt.verify(token, process.env.JWT_SECRET,{expiresIn:"24h"})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.clearCookie("authCookies")
        res.status(400).json({ error: e.message })
    }
}    


export default auth





