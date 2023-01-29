import express from 'express'
import adminAuth from '../../../middleware/adminAuth.js'
import Product from '../../../models/ProductModel.js'
const router = express.Router()
 
//home page 
router.get("/" , (req,res)=>{
    res.render("index")
})
//create admin user page
router.get("/createUser" , (req,res)=>{
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

// GET /tasks?limit=10&skip=20
router.get("/view_product" ,adminAuth, async(req,res)=>{
    const product = await Product.find({})
    .limit(req.query.limit || 4)
    .skip(req.query.skip|| 0)
    
    const count = await Product.countDocuments();

    res.render("viewProduct",{
        product:product,
        totalPages: Math.ceil(count / req.query.limit||4),
        currentPage:req.query.skip||0
    })  
})
//view products by id 

router.get('/view_products/:id', async(req, res) => {
    
    const product = await Product.findById(req.params.id).populate('reviews');

    res.render('products/show', { product: product });
})


// Showing a particular product


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