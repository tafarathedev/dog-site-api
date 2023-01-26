//how to implement jwt.verify method?
import jwt from 'jsonwebtoken'
import dotenv from  'dotenv'

dotenv.config()

    
  

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.adminAuthCookies
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET,{expiresIn:"24h"})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error("")
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.clearCookie("adminAuthCookies")
        res.status(400).json({ error: e.message })
    }
}    


export default adminAuth





