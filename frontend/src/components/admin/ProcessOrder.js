import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
// import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrder, getOrderDetails, clearError } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'

const ProcessOrder = () => {
    const  [status, setStatus] = useState('')
     
    // const alert = useAlert()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    
    const { loading, order = {} } = useSelector(state => state.orderDetails)
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const { error, isUpdated } = useSelector(state => state.order)

    const orderId = params.id;

    useEffect(() => {
        dispatch(getOrderDetails(orderId));

        if (error) {
            alert(error);
            dispatch(clearError())
        }
        if (isUpdated) {
            // navigate('/admin/products');
            alert('Order status updated successfully');
            dispatch({ type: UPDATE_ORDER_RESET })
        }

    }, [dispatch, error, isUpdated, orderId])

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);
        dispatch(updateOrder(id, formData))
    }

    
    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false  

    return (
        <Fragment>
        <div className="container-fluid">
            <MetaData title={`Process Orders: #${order && order._id}`} />
            <div className="row">
                <div className="col-md-2">
                    <Sidebar />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="card">
                            <div className="card-header">
                                <h2 className="my-4">Order:  #{order._id}</h2>
                            </div>
                            <div className="card-body pl-4">
                                <div className="row pl-4">
                                    <div className="col-md-6">
                                        <h4 className="mb-4 ">Shipping Info</h4>
                                        <p ><b>Name:</b> {user && user.name}</p>
                                        <p ><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                        <p ><b>Address:</b> {shippingDetails}</p>
                                        <p ><b>Amount:</b> ₹{totalPrice}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex p-6 mb-3">
                                            <h4 className="mr-3">Payment:</h4>
                                            <p className={isPaid ? "text-success" : "text-danger"}>
                                                {isPaid ? "PAID" : "Pending"}
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <h4 className='mr-3'>Payment ID: </h4>
                                            <p>{isPaid && paymentInfo && paymentInfo.id}</p>
                                        </div>
                                        
                                        <div className="d-flex  justify-content space-between mb-3">
                                            <h4 className='mr-4'>Order Status: </h4>
                                            <p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "text-success" : "text-danger"}>
                                                <b>{orderStatus}</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <h4 className="my-4">Order Items:</h4>
                                <div className="cart-item">
                                    {orderItems &&
                                        orderItems.map((item) => (
                                            <div key={item.product} className="row my-4">
                                                <div className="col-md-3">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        height="65"
                                                        width="100"
                                                        className="img-fluid"
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                </div>
                                                <div className="col-md-3">
                                                    <p>₹{item.price}</p>
                                                    <p>{item.quantity} Piece(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="my-4 text-danger">Update Order Status</h4>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="status"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => updateOrderHandler(order._id)}
                                        >
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </Fragment>
    );
};

export default ProcessOrder;