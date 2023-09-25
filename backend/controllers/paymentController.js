

const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = (async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        automatic_payment_methods: {enabled: true},
        description: 'Ecomerse Application services',
      });

    res.status(200).json({
        client_secret: paymentIntent.client_secret
    })
})


//send stripe API key to frontend ==>>  /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next)=>{

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY,
    })
})