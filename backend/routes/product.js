const express = require('express');
const router = express.Router();


//import all controller 
const {
     getProducts,
     getAdminProducts,
     newProduct,
     getSingleProduct,
     updateProduct,
     deleteProduct,
     createProductReview,
     getProductReviews,
     deleteProductReview

}= require('../controllers/productController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')



//product routing
router.route('/products').get(getProducts); // get all product
router.route('/admin/products').get(getAdminProducts); // get all admin product  

router.route('/product/:id').get(getSingleProduct); //get singe product by id
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct); // post new product
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct); // update Product  product by id
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct); // delete Product  product by id

//review product
router.route('/review').put(isAuthenticatedUser, createProductReview); // createcProduct Review
router.route('/reviews').get(isAuthenticatedUser, getProductReviews); // createcProduct Review
router.route('/reviews').delete(isAuthenticatedUser, deleteProductReview) // delete Product Review



module.exports = router;