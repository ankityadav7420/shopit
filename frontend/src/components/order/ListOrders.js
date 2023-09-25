import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearError } from '../../actions/orderActions';

const ListOrders = () => {
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());

        if (error) {
            alert(error);
            dispatch(clearError());
        }
    }, [dispatch, error]);

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                },
                {
                    label: 'Payment Status',
                    field: 'paymentStatus',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
                },
            ],
            rows: [],
        };
        orders && orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `₹${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                paymentStatus: order.paymentInfo && String(order.paymentInfo.status).includes("succeeded")
                ? <p className='text-success'>{`PAID`}</p>
                : <p className='text-danger'>{`Pending`}</p>,
                actions: (
                    <Link to={`/order/${order._id}`} className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </Link>
                ),
            });
        });
        return data;
    };

    return (
        <Fragment>
            <MetaData title={'My Orders'} />
            <h1 className="my-4 mx-4">My Orders</h1>
            <span className='text-primary mx-4'>Total {orders && orders.length} orders</span>

            {loading ? (
                <Loader />
            ) : (
                <MDBDataTable
                    data={{
                        columns: setOrders().columns,
                        rows: setOrders().rows,
                    }}
                    className="px-3"
                    bordered
                    striped
                    hover
                />
            )}
        </Fragment>
    );
};

export default ListOrders;
