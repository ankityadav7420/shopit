const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const getResetpasswordToken = require('../models/user');
const crypto = require('crypto');
const user = require('../models/user');
const cloudinary = require('cloudinary').v2 // for image upload 

//resgister an user;
exports.registerUser = catchAsyncErrors (async (req,res,next)=>{
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder:'avatars',
        width:150,
        crop:'scale'
    });
    // console.log(result,"result")
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result?.public_id,
            url: result?.secure_url
        }
    })
    sendToken(user,200,res);
})

//login user  /api/v1/login

exports.loginUser  = catchAsyncErrors (async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next( new ErrorHandler('Please enter email and username'));
    }
    //finding user in DB
    const user = await User.findOne({email}).select('+password'); //usig select bcs in schema we added select false
    if(!user){
        return next( new ErrorHandler('Invalid email or usename',401));
    }
    //checks is password is correct or not
    const  isPasswordMatched = await user.comparePassword(password)  // comparePassword defined in user model
    if(!isPasswordMatched){
        return next( new ErrorHandler('Invalid email or usename',401));
    }
    //if use is correct return token
    sendToken(user,200,res);
})



    //Forgat password  /api/v1/password/forgot   
exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next( new ErrorHandler('You are not registerd, Email not found',401));
    }
    //get reset token
    const resetToken = user.getResetpasswordToken();
    await user.save({validateBeforeSave: false})
    //create reset password url
    const reseturl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`  // remove in production mode
    // const reseturl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    // console.log(reseturl,"reseturl")
    const message= `Your password reset passowrd is as follow:\n\n ${reseturl}\n\nIf you have not requested this then contact admin`
    try{
        await sendEmail({ //sending in testing mode on mailtrap only
            email:user.email,
            subject:'ShopIT password Recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to : ${user.email}`
        })
    }catch{ //if any error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message,500))
    }
})

                        //reset password  /api/v1/password/reset/:token   
exports.resetPassword = catchAsyncErrors (async (req,res,next)=>{
     //hash the url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })
    if(!user){ //if token expired
        return next( new ErrorHandler('Password reset Token invalid or expired',400))
    }
    if(req.body.password !== req.body.confirmPassword){ //if both password and confirm password didn't match
        return next( new ErrorHandler('password does not match',400));
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res); //send toke after everythong correct
})


//get currently loggedin user /api/v1/me
exports.getUserProfile = catchAsyncErrors ( async (req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

//update/change password   /api/v1/password/update
exports.updatePassword = catchAsyncErrors ( async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //check prvious password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next( new ErrorHandler('Old password is not matched',400))
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res);
})

//update user profile  /api/v1/me/update
exports.updateProfile = catchAsyncErrors ( async (req, res, next)=>{
    const newuserData= {
        name:req.body.name,
        email: req.body.email
    }
    // TO DO Update avtar
    const user = await User.findByIdAndUpdate(req.user.id, newuserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false
    })
    res.status(200).json({
        succes:true,
        message:'Profile Updated Succesfully',
        newuserData
    })
})

//logut user   /api/v1/logout   setting cookiew null and make it expired
exports.logout = catchAsyncErrors (async (req,res,next)=>{
    res.cookie('token', null,{
            expires:new Date(Date.now()),
            httpOnly:true
    })
    res.status(200).json({
        succes:true,
        message: 'User Logged out succesfully'
    })
})

//admin routes

//get all user  /api/v1/admin/users
exports.allUsers =catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();
    const userCount = await User.countDocuments()

    res.status(200).json({
        success:true,
        userCount,
        message:"User data got succesfully.",
        users
    })
})

//get  user details  /api/v1/admin/users/:id
exports.getUserDetails =catchAsyncErrors(async (req,res,next)=>{
    const users = await User.findById(req.params.id);
    if(!users){
        return next( new ErrorHandler(`User doese not found with id ${req.params.id}`,404))
    }
    res.status(200).json({
        success:true,
        users
    })
})

//update user profile by admin   /api/v1/admin/user/:user_id
exports.updateUserProfile = catchAsyncErrors ( async (req, res, next)=>{
    const newuserData= {
        name:req.body.name,
        email: req.body.email,
        role:req.body.role
    }
    // Update avtar
    if(req.body.avatar !==''){
        const user= await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder:'avatars',
            width:150,
            crop:'scale'
        });
        newuserData.avatar = {
            public_id:result.public_id,
            url:result.secure_url
        }

    }
    const user = await User.findByIdAndUpdate(req.params.id, newuserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false
    })
    res.status(200).json({
        succes:true,
        message:'Profile Updated Succesfully',
        newuserData
    })
})

//delete user==>>   /api/v1/admin/user/:id
exports.deleteUser =catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next( new ErrorHandler(`User doese not found with id: ${req.params.id}`,404))
    }
    // TO DO remove avtar
    // await user.remove();
    await User.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({
        success:true,
        message:'User removed succesfully',
    })
})