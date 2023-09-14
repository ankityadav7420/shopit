// store.js
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {createStore, combineReducers, applyMiddleware } from 'redux';
import {productReducers, productDetailsReducer} from './reducers/productReducers';

import{authReducer, userReducer, forgotPasswordReducer} from './reducers/userReducer'



const reducer = combineReducers({
    products:productReducers,
    productDetails: productDetailsReducer,
    auth:authReducer,
    user:userReducer,
    forgotPassword: forgotPasswordReducer
})

const middlware = [thunk];
let initialState = {}

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;
