const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase =require('./config/database');
const cloudinary = require('cloudinary').v2


//handel uncought exception
process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.message} ${err.stack}`);
    console.error("Shutting down server due to uncaughtException");
    process.exit(1);

})

//setting config file
dotenv.config({path:'backend/config/config.env'});

//connecting DB
connectDatabase()


// setting up cloduinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


//server listening
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server id up and runningon port": ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`ERROR: ${err.message}`);
    console.error("Shutting down server due to unhandledRejection");
    server.close(() => {
        process.exit(1);
    });
});