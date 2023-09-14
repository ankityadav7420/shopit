import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layout/MetaData'
import {useDispatch, useSelector} from 'react-redux';
import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import Loader from './layout/Loader';
import { useParams } from 'react-router-dom';

// import {useAlert} from 'react-alert'
import 'rc-slider/assets/index.css';

// import Slider, {Range}  from 'rc-slider';
// const createSliderWithTooltip = Slider.createSliderWithTooltip;
import Slider, { createSliderWithTooltip } from 'rc-slider';

// const Range = Slider.Range;


// TO DO add filter
const Home = () => {
    // const alert  =useAlert()

    const [currentPage, setCurrentPage] =useState(1);
    const [price, setPrice] = useState([1,1000]);

    const params = useParams();
    const dispatch = useDispatch();
    const  {loading, products, error, productsCount} = useSelector(state=>state.products)
    // console.log(products)

    const keyword =params.keyword;
    useEffect(()=>{
        if(error){
            return error;
            // console.log(error)
        }
        dispatch(getProducts(keyword,currentPage, price));
        
    },[dispatch,keyword, error, currentPage, price])

  return (
    <Fragment>
        {loading? <Loader /> :(
            <Fragment>
                 <MetaData title={'Buy Best Product Online'} /> 
                <h1 id="products_heading">Latest Products</h1>

                <section id="products" className="container mt-5">
                <div className="row">
                       { products && products.map(product=>(
                            <Product key={product._id} product={product} />
                        ))}
                    
                </div>
                </section>
            </Fragment>
        )}
       
    </Fragment>
  )
}

export default Home