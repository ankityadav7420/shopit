const express = require('express');
const app = express();
const cors = require('cors'); // Import cors correctly
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv');

const errorMiddleware = require('./middlewares/errors');

// Setting up config file
// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({ path: 'backend/config/config.env' })
app.use(cors()); // Use cors() as middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', payment);
app.use('/api/v1', order);

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
}

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
