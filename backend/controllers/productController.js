const Product  =require('../models/product')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary')

//create new product admin  => /admin/api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req,res,next)=>{
    let images =[]
    if(typeof req.body.images === 'string'){
        images.push(req.body.images)
    }
    else{
        images = req.body.images
    }
    let imagesLinks = [];
    for(let i=0;i<images?.length;i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})


//GET all products  => api/v1/products
exports.getProducts= catchAsyncErrors(async (req, res, next)=>{
    const perPage = 50;
    const productsCount = await Product.countDocuments()
    const apifeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagination(perPage)

    const products = await  Product.find();
    res.status(200).json({
        success:true,
        count:products?.length,
        productsCount,
        products
    })
})

//GET all products for admin => api/v1/admin/products
exports.getAdminProducts= catchAsyncErrors(async (req, res, next)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    })
})

//GET single product using id => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ErrorHandler('product not found', 404);
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error); // Passinf the error to the error handling middleware
    }
});


//UPDATE single product using id  admin only=> admin/api/v1/product/:id
exports.updateProduct= catchAsyncErrors(async (req, res, next)=>{
   let product = await Product.findById(req.params.id);
   if (!product) {
       throw new ErrorHandler('product not found', 404);
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images?.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        product
    })
})



//DELETE single product using id => admin/api/v1/product/:id
exports.deleteProduct= catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if (!product) {
        throw new ErrorHandler('product not found', 404);
    }
    //deleting associated img
    for(let i=0;i<product.images.length;i++){
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await Product.deleteOne()
     res.status(200).json({
         success:true,
         message:'Product deleted succesfully',
     })
 })


 //create new review ==>> api/v1/review
 exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product?.reviews.find(
        r => r.user?.toString() === req?.user._id?.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user?.toString() === req.user._id?.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }
    // overall rating calculating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


 //GET  review of any specific product   /api/v1/reviews
 exports.getProductReviews = catchAsyncErrors (async (req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if (!product) {
        throw new ErrorHandler('product not found', 404);
    }
    res.status(200).json({
        succes:true,
        message:'Review Data retrived succesfully.',
        reviews:product.reviews
    })
 })

  // Delete Product Review   =>   /api/v1/reviews
  exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);  // Use productId instead of id
    if (!product) {
        throw new ErrorHandler('Product not found', 404);
    }
    const reviews = product.reviews.filter(review => review._id?.toString() !== req.query.reviewId?.toString());
    const numOfReviews = reviews.length;
    let ratings =0;
    if(numOfReviews)
     ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;  // Use reviews.length instead of product.reviews.length
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
