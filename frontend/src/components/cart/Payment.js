import React, { Fragment, useEffect } from 'react'
import MetaData from '../layout/MetaData'
// import {useAlert} from 'react-alert'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Checkoutsteps from './Checkoutsteps'
import axios from 'axios'
import {createOrder, clearError} from '../../actions/orderActions'
//payment
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';


const options ={
    style:{
        base:{
            fontSize:'16px'
        },
        invalid:{
            color:'#9e2146'
        }
    }
}
//  TO DO patment process

const Payment = ({stripeApiKey}
) => {

    const stripe= useStripe()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const elements= useElements();

    const {user} = useSelector(state=> state.auth)
    const {cartItems, shippingInfo} =  useSelector(state => state.cart)
    const {error} =  useSelector(state=>state.newOrder)

    useEffect(()=>{
        if(error){
            alert(error," Unexpected Happens")
            dispatch(clearError);
        }
    },[dispatch, error])

    //order object to pass order
    const order = {
        orderItems: cartItems,
        shippingInfo
    }
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }
    const paymentData = { 
        amount: Math.round(orderInfo.totalPrice * 100)
    }

     const submitHandler = async (e)=>{
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        let res;
        try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `stripeApiKey`
                    }
                }
                // navigate('/success')
                res = await axios.post('/api/v1/payment/process', paymentData, config)
                const client_secret = res.data.client_secret;
                if(!stripe || !elements){

                    return;
                }
                const result = await stripe.confirmCardPayment(client_secret, {
                    payment_method: 
                    {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name,
                            email: user.email
                        }
                    }
                });
                if(result.error){
                        alert(result.error.message," result.error");
                        document.querySelector('#pay_btn').disabled = false;
                }else{
                    if(result.paymentIntent.status ==='succeeded'){

                        order.paymentInfo = {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status
                        }
                        dispatch(createOrder(order))
                        // dispatch()
                        navigate('/success')
                    }else{
                        alert('There is some issue while payment processing');
                    }
                }
            }catch(error){
                document.querySelector('#pay_btn').disabled =false;
                alert(error)
            }
     }

    return (
    <Fragment>
        <MetaData  title={'payment page'}/>
         <Checkoutsteps shipping  confirmOrder  payment />
         <div className="row wrapper">
		<div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-4">Card Info</h1>
                <div className="form-group">
                  <label htmlFor="card_num_field">Card Number</label>
                  <CardNumberElement
                    type="text"
                    id="card_num_field"
                    className="form-control"
                    options={options}
                />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_exp_field">Card Expiry</label>
                  <CardExpiryElement
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                    options={options}
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_cvc_field">Card CVC</label>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                    options={options}
                  />
                </div>
      
            
                <button
                  id="pay_btn"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  Pay {`₹${orderInfo && orderInfo.totalPrice}`}
                </button>
    
              </form>
			  </div>
        </div>
    </Fragment>
  )
}

export default Payment