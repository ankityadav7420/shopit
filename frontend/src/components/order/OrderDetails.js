import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clearError } from '../../actions/orderActions';

const OrderDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, error, order = {} } = useSelector((state) => state.orderDetails);
  const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;

  useEffect(() => {
    dispatch(getOrderDetails(params.id));

    if (error) {
      console.log(error);
      dispatch(clearError);
    }
  }, [dispatch, error, params.id]);

  const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;
  const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

  return (
    <Fragment>
      <MetaData title={`Order Details`} />
      <div className="col-md-10">
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
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
                    orderItems.map((item, index) => (
                        <div
                        key={item.product}
                        className={`row my-4 ${index % 2 === 0 ? 'bg-light' : ''}`}
                        >
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
                </div>
            </div>
        </Fragment>
      )}
      </div>
    </Fragment>
  );
};

export default OrderDetails;
