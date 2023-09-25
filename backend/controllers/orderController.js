const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const order = require('../models/order');

//update stock function
async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false});
    console.log(product.stock,"sttttt")
}
//create a new order  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;
    for (const item of orderItems) {
        await updateStock(item.product, item.quantity)
    }
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })


    res.status(200).json({
        success: true,
        order
    })
})

//get singale order by id   /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors( async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        message:'Order Data got succesfully.',
        order
    })
})

//get loggedin user order   /api/v1/orders/me
exports.getMyOrders = catchAsyncErrors( async (req,res,next)=>{
    const order = await Order.find({user: req.user.id}) // getting users order
    if(!order){
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`,404));
    }
    const orderCount = await Order.countDocuments()

    res.status(200).json({
        success:true,
        message:'Order Data got succesfully.',
        orderCount,
        order
    })
})


//get all order in DB  Admin acces only   /api/v1/admin/orders
exports.allOrders = catchAsyncErrors( async (req,res,next)=>{
    const orders = await Order.find()
    if(!orders){
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`,404));
    }
    const orderCount = await Order.countDocuments()
    let totalAmmount=0;
    orders.forEach(order => {
        totalAmmount+=order.totalPrice;
        
    });
    res.status(200).json({
        success:true,
        message:'Order Data got succesfully.',
        orderCount,
        totalAmmount,
        orders
    })
})

//update  process order  Admin acces only   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors( async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`,404));
    }
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('You have already delevered order',400))
    }
    // order.orderItems.forEach(async item=>{
    //     await updateStock(item.product, item.quantity)
    // })

    order.orderStatus = req.body.status;
    order.deleveredAt = Date.now()
    await order.save();
    res.status(200).json({
        success:true,
        message:'Order Data got updated succesfully.',
        order
    })
})



//delete  order by id   /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`, 404));
        }

        await Order.findOneAndDelete({ _id: req.params.id }); // Use await here

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully by admin.'
        });
    } catch (error) {
        next(error);
    }
});
