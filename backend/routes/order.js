const express = require('express');
const router = express.Router();

const {
    newOrder,
    getSingleOrder,
    getMyOrders,
    allOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

//order route
router.route('/order/new').post(isAuthenticatedUser, newOrder); //create route for new order
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);//create route for getSingleOrder
router.route('/orders/me').get(isAuthenticatedUser, getMyOrders);//create route for getMy Orders
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'), allOrders);//create route for all Orders
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'), updateOrder);//create route for update Order Orders
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteOrder);//create route for delete Order Order Orders

module.exports = router;