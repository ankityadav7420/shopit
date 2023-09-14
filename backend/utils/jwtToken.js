//creating send token and save in cookie
const sendToken  = (user, statusCode, res)=>{
    //create JWT token
    const token = user.getJwtToken();

   // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000 // Corrected multiplication
        ),
        httpOnly: true
    };

//sending response
    res.status(statusCode).cookie('token', token, options).json({
        success:true,
        sameSite: 'None',
        secure:true,
        token,
        user
        
    });
}

module.exports = sendToken;