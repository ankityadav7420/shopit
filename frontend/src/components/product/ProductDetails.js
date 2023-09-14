import React, { Fragment, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom';
// import {useAlert} from 'react-alert'
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import {Carousel} from 'react-bootstrap'
import {getProductDetails, clearError } from '../../actions/productActions';

const ProductDetails = () => {
    // const alert = useAlert()
    const dispatch = useDispatch();
    const { loading, error, product } = useSelector(state => state.productDetails); // Update this line
    console.log(product?.product)
    console.log(product?.product?.seller)
    const params =useParams()
    useEffect(()=>{
        if(error){
            dispatch(clearError)
            return error(error);
        }
        dispatch(getProductDetails(params.id));
    },[dispatch,error,params.id])
  return (
    <Fragment>
    {loading ? <Loader />: (
        <Fragment>
                <MetaData title={product?.product?.name} />
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Carousel pouse='hover'>
                        {product?.product?.images && product?.product?.images.map(image=>{
                            <Carousel.Item key={image.public_id}>
                                <img className='d-block w-100' src={image?.url} alt={product?.product?.name} />
                            </Carousel.Item>
                        })}
                    </Carousel>
                    {/* TO DO: remove below image and activate above map by rreal img from DB */}
                    <img src="https://i5.walmartimages.com/asr/1223a935-2a61-480a-95a1-21904ff8986c_1.17fa3d7870e3d9b1248da7b1144787f5.jpeg?odnWidth=undefined&odnHeight=undefined&odnBg=ffffff" alt="sdf" height="500" width="500" />
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product?.product?.name}</h3>
                    <p id="product_id">{product?.product?._id}</p>

                <hr />

                <div className="ratings mt-auto">
                        <div className="rating-outer">
                        <div className="rating-inner" style={{width:`${(product?.product.ratings/5) *100}%`}}></div>
                        </div>
                        <span id="no_of_reviews">({product?.product.numOfReviews} Reviews)</span>
                    </div>
                <hr />

                <p id="product_price">${product?.product?.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus">-</span>
                    <input type="number" className="form-control count d-inline" value="1" readOnly />
                    <span className="btn btn-primary plus">+</span>
                </div>
                <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button>

            <hr />

                <p>Status: <span id="stock_status" className={product?.product?.stock >0 ?"greenColor" : 'redColor'}>
                    {product?.product?.stock >0 ?"In Stock" : 'Out of Stock'}
                </span></p>

            <hr />

            <h4 className="mt-2">Description:</h4>
            <p>{product?.product?.description}</p>
        <hr />
            <p id="product_seller mb-3">Sold by: <strong>{product?.product?.seller}</strong></p>
            <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                        Submit Your Review
            </button>
        
        <div className="row mt-2 mb-5">
            <div className="rating w-50">
                <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="stars" >
                                    <li className="star"><i className="fa fa-star"></i></li>
                                    <li className="star"><i className="fa fa-star"></i></li>
                                    <li className="star"><i className="fa fa-star"></i></li>
                                    <li className="star"><i className="fa fa-star"></i></li>
                                    <li className="star"><i className="fa fa-star"></i></li>
                                </ul>
                                <textarea name="review" id="review" className="form-control mt-3">
                                </textarea>
                                <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                
    </div>

</div>
</div>
        </Fragment>
    )}
    </Fragment>
  )
}

export default ProductDetails