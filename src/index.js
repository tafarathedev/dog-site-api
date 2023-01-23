import express from 'express'
import './server/server.js'
import cors from  'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import UserRouter from './routes/UserRouter.js'
import bodyParser from 'body-parser'
dotenv.config()
const app = express() 
//port 
const port = process.env.PORT 
//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(cors({ 
    origin: '*',
    optionsSuccessStatus:200
}))
app.use("/api/user/", UserRouter)



app.listen(port, ()=>console.log('listening on '+port))