import express from 'express'
import './server/server.js'
import path from 'path'
import cors from  'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import UserRouter from './routes/UserRouter.js'
import ProductRouter from './routes/ProductRouter.js'
import DogsRouter from './routes/DogsRouter.js'
import AdminUser from './routes/Admin/api/AdminRouter.js'
import pageRouter from './routes/Admin/site/admin.router.js'
import sessions from 'express-session'

dotenv.config()

//express function
const app = express() 
//port 
const port = process.env.PORT 
//middleware and body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(path.join('../public')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(cors({ 
    origin: '*',
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.use(sessions({
    secret: "thisismyseceret",
    saveUninitialized:true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
     },
    resave: false 
}));
// router routes
app.use(UserRouter)
app.use(ProductRouter)
app.use(DogsRouter)
app.use(AdminUser)
app.use("/site",pageRouter)


app.listen(port, ()=>console.log('listening on '+port))