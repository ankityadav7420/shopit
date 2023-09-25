// store.js
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {createStore, combineReducers, applyMiddleware } from 'redux';
import {productReducers,newProductReducer, productDetailsReducer, newReviewReducer, productReducer, productReviewsReducer, reviewReducer } from './reducers/productReducers';

import{ authReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducers';
import {newOrderReducer, myOrdersReducers, orderDetailsReducers, allOrdersReducer,orderReducer  } from './reducers/orderReducers'

const reducer = combineReducers({
    products: productReducers,
    productDetails: productDetailsReducer,
    
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,

    allUsers:allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review:reviewReducer,

    cart: cartReducer,
    newOrder:newOrderReducer,
    myOrders: myOrdersReducers,
    orderDetails: orderDetailsReducers,

    order:orderReducer,
    allOrders:allOrdersReducer,

    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer
})

const middlware = [thunk];
let initialState = {
    cart:{
        cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
        shipppingInfo: localStorage.getItem('shipppingInfo')
        ? JSON.parse(localStorage.getItem('shipppingInfo'))
        :{}
    }
}

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;
