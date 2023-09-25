import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layout/MetaData'
import {useDispatch, useSelector} from 'react-redux';
import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import Loader from './layout/Loader';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination'
import 'rc-slider/assets/index.css';

// import Slider, {Range}  from 'rc-slider';
// const createSliderWithTooltip = Slider.createSliderWithTooltip;


// TO DO add filter
const Home = () => {
    // const alert  =useAlert()

    const [currentPage, setCurrentPage] =useState(1);
    const [price, setPrice] = useState([1, 500000]);
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const categories = [
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]
    const params = useParams();
    const dispatch = useDispatch();
    const  { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state=>state.products)
    const keyword =params.keyword;
    useEffect(()=>{
        if(error){
            return error;
        }
        dispatch(getProducts(keyword, currentPage, price, category, rating));
        
    },[dispatch, keyword, error, currentPage, price, category, rating ])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
     }
     let count = productsCount;
     if (keyword) {
         count = filteredProductsCount
     }
  return (
    <Fragment>
        {loading? <Loader /> :(
            <Fragment>
                 <MetaData title={'Buy Best Product Online'} /> 
                <h1 id="products_heading pl-4">Latest Products</h1>

                <section id="products" className="container mt-5">
                <div className="row">
                         {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4>

                                                <ul className="pl-0">
                                                    {categories && categories.map(category => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={category}
                                                            onClick={() => setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <hr className="my-3" />

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Ratings
                                                </h4>

                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                        >
                                                            <div className="rating-outer">
                                                                <div className="rating-inner"
                                                                    style={{
                                                                        width: `${star * 20}%`
                                                                    }}
                                                                >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products && products.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products && products.map(product => (
                                        <Product key={product._id} product={product} col={3} />
                                    ))
                                )}

                    </div>
                </section>
                {resPerPage <= productsCount && (
                    <div className='d-flex justify-content-center mt-5'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resPerPage}
                            totalItemsCount={count}
                            onChange={setCurrentPageNo}
                            nextPageText={'Next'}
                            prevPageText={'Prev'}
                            firstPageText={'First'}
                            lastPageText={'Last'}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                </div>
                )}
                
            </Fragment>
        )}
    </Fragment>
  )
}

export default Home