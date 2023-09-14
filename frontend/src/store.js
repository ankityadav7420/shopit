// store.js
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {createStore, combineReducers, applyMiddleware } from 'redux';
import {productReducers, productDetailsReducer} from './reducers/productReducers';

import{authReducer, userReducer, forgotPasswordReducer} from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducers';


const reducer = combineReducers({
    products:productReducers,
    productDetails: productDetailsReducer,
    auth:authReducer,
    user:userReducer,
    forgotPassword: forgotPasswordReducer,
    cart:cartReducer
})

const middlware = [thunk];
let initialState = {
    cart:{
        cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : []
    }
}

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;
