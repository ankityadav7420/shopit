const express = require('express');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles}  =require('../middlewares/auth'); 

const {
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/authController');


//user route
router.route('/register').post(registerUser);//creating route for register user
router.route('/login').post(loginUser);//creating route for loginUser
router.route('/logout').get(logout);//creating route for log out

router.route('/password/forgot').post(forgotPassword);//creating route for forgot Password
router.route('/password/reset/:token').put(resetPassword);//creating route for reset Password
router.route('/me').get(isAuthenticatedUser, getUserProfile);//creating route for getUser Profile
router.route('/password/update').put(isAuthenticatedUser, updatePassword);//creating route for update Password
router.route('/me/update').put(isAuthenticatedUser, updateProfile );//creating route for update Profile 

//admin for user acces allUsers
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), allUsers);//creating route for all Users
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUserDetails);//creating route for getUserDetails
router.route('/admin/users/:id').put(isAuthenticatedUser,authorizeRoles('admin'), updateUser);//creating route for update User Profile by admin
router.route('/admin/users/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);//creating route for delete User Profile by admin


// 
module.exports = router;