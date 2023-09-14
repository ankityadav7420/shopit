const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


//creating userSchema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter you name'],
        maxLength:[30, 'user name can not exceed 30 charecter']
    },
    email:{
        type:String,
        required:[true,'please enter your email'],
        unique:true,
        validate:[validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minLength: [6, 'Your password must be longer than 6 characters'],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },    
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:String,
        default: Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

//encrypting password before save
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);//encytpting using bcrypt
})

//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//return json JWT token
userSchema.methods.getJwtToken= function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}


//genrate password reset token
userSchema.methods.getResetpasswordToken = function(){
    //genrate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash and set to reset password Token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //set token expired time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken;
}


module.exports = mongoose.model('User',userSchema);