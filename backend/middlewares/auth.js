const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


//checks if user is authenticated or not  // decoding token from ckkoie and verifying to check it
exports.isAuthenticatedUser = catchAsyncErrors( async( req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        return next( new ErrorHandler('Login first to acces this resourcce',401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user  = await User.findById(decoded.id)
    next()
})

//handeling usr role

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user)
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}