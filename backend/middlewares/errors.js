const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    // err.message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }
    
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err };
        error.message = err.message;
        //wrong mongoose objectID error
        if(err.name ==='CastError'){
            const message =`Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //handeling mongoose validation error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value=>value.message);
            error = new ErrorHandler(message, 400)
        }
      //handeling mongoose dublicate key eror
      if(err.code ===11000){
         const message=  `Dublicate  ${Object.keys(err.keyValue)} entered`;
         error = new ErrorHandler(message, 400)
      }
      //handeling wrong JWT error
      if(err.name ==='jsonWebTokenError'){
        const message=  `JSON web token is Invalid, Try after some time`;
        error = new ErrorHandler(message, 400)
     }
     //handeling  JWT token expired error
     if(err.name ==='jsonWebTokenError'){
        const message=  `JSON web token is Expired, Try again!!`;
        error = new ErrorHandler(message, 400)
     }


        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
}


    res.status(err.statusCode).json({
        success: false,
        message: err.message // Using err.message instead of err.stack
    });
};


