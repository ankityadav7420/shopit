import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
// import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearError } from '../../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../../constants/productConstant'

const ProductsList = () => {

    // const alert = useAlert();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getAdminProducts());

        if (error) {
            console.log(error);
            dispatch(clearError())
        }

        if (deleteError) {
            alert(deleteError);
            dispatch(clearError())
        }

        if (isDeleted) {
            console.log('Product deleted successfully');
            navigate('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

    }, [dispatch, error, isDeleted, deleteError, navigate])

    const setProducts = () => {
        const data = {
            columns: [
              
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        products && products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `₹${product.price}`,
                stock: product.stock,
                actions:<Fragment>
                            <Link to={`/admin/product/${product._id}`}
                                     className="btn btn-primary p-1 py-1 m-1"
                                    >
                                <i className="fa fa-pencil"></i> 
                            </Link>
                            <button 
                                className="btn btn-danger py-1 px-1" 
                                onClick={()=>deleteProductHandler(product._id)}
                            >
                            <i className="fa fa-trash"></i> 
                            </button>
                        </Fragment>
              
            })
        })

        return data;
    }

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
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

export default ProductsList