import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
// import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allOrders, clearError, deleteOrder } from '../../actions/orderActions'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'

const OrderList = () => {
    // const alert = useAlert();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order)

    const isPaid = orders?.paymentInfo && orders?.paymentInfo.status === 'succeeded' ? true : false;

    useEffect(() => {
        dispatch(allOrders());

        if (error) {
            console.log(error);
            dispatch(clearError())
        }

        if (isDeleted) {
            alert('Order deleted successfully');
            navigate('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET })
        }

    }, [dispatch, error, isDeleted, navigate])

    const deleteOrderHandler =(id)=>{
        dispatch(deleteOrder(id))
    }

    const setOrders = () => {
        const data = {
            columns: [
              
                {
                    label: ' Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'No. of Items',
                    field: 'NumOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Order Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Payment Status',
                    field: 'paymentStatus',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        orders && orders.forEach(order => {
            data.rows.push({
                id: order._id,
                NumOfItems: order.orderItems.length,
                amount: `₹${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p className='text-success'>{order.orderStatus}</p>
                    : <p className='text-danger'>{order.orderStatus}</p>,
                paymentStatus: order.paymentInfo && String(order.paymentInfo.status).includes("succeeded")
                    ? <p className='text-success'>{`PAID`}</p>
                    : <p className='text-danger'>{`Pending`}</p>,
                actions: (
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
                            <i className="fa fa-eye"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-1 ml-2"
                        onClick={()=>deleteOrderHandler(order._id)}
                        >
                            <i className="fa fa-trash"></i> 
                    </button>
                </Fragment>
                ),
            })
        })

        return data;
    }
  return (
        <Fragment>
        <MetaData title={'All Orders'} />
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <Fragment>
                    <h1 className="my-5">All Orders</h1>

                    {loading ? <Loader /> : (
                        <MDBDataTable
                            data={setOrders()}
                            className="px-3"
                            bordered
                            striped
                            hover
                        />
                    )}
                </Fragment>
            </div>
        </div>

    </Fragment>
)
}

export default OrderList