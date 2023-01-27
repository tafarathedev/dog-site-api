import express from 'express'
import adminAuth from '../../../middleware/adminAuth.js'
import Product from '../../../models/ProductModel.js'
const router = express.Router()
 

//create admin user page
router.get("/create_user" , (req,res)=>{
    res.render("register")
})
//login admin user page
router.get("/login" , (req,res)=>{
    res.render("login")
})

//view admin dashboard
router.get("/dashboard" ,adminAuth, (req,res)=>{
    res.render("dashboard")
})

//manage products page
router.get("/product_management",adminAuth,(req,res)=>{
  res.render("productManagement")
})

//add new listing 
router.get("/add_product" ,adminAuth, (req,res)=>{
    res.render("newProduct")
})

router.get("/view_product" ,adminAuth, async(req,res)=>{
    const product = await Product.find({})
    res.render("viewProduct",{
        name:product
    })  
})
//view products by id 

router.get('/view_products/:id', async(req, res) => {
    
    const product = await Product.findById(req.params.id).populate('reviews');

    res.render('viewProductById', { product: product });
})


// Showing a particular product

router.get('/products/:id', async(req, res) => {
    
    const product = await Product.findById(req.params.id).populate('reviews');

    res.render('products/show', { product: product });
})

// Edit product


router.get('/products/:id/edit', async(req, res) => {
    
    const product = await Product.findById(req.params.id);

    res.render('products/edit', { product: product });
})

// patch request


router.patch('/products/:id', async(req, res) => {
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body.product);

    res.redirect(`/products/${req.params.id}`);
})

// Delete Product 


router.delete('/products/:id', async(req, res) => {
    
    await Product.findByIdAndDelete(req.params.id);

    res.redirect('/products');
})


export default router