import {ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO} from '../constants/cartConstant'
import axios from 'axios'

//add item to cart
export const addItemToCart = (id, quantity)=> async (dispatch, getState) => {
    const {data} =await axios.get(`/api/v1/product/${id}`)
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    })
    //storing in local
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

//remove cart item
export const removeItemFromCart = (id)=> async (dispatch, getState) => {
    dispatch({
        type:REMOVE_CART_ITEM,
        payload: id
    })
    //storing in local
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

//save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))

}