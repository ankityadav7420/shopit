import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
import Login from './components/user/Login';
import Register from './components/user/Register';
import {loadUser} from './actions/userActions'
import store from './store'
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import axios from 'axios';
import Payment from './components/cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import { useSelector } from 'react-redux';

//admin import
import Dashboards from './components/admin/Dashboards';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';

function App() {

  const [stripeApiKey, setStripeApiKey]= useState('')
  useEffect(() => {
    console.log("dispated")
    store.dispatch(loadUser());
  
    async function getStripeApiKey() {
      try {
        const { data } = await axios.get('/api/v1/stripeapi');
        setStripeApiKey(data?.stripeApiKey);
      } catch (error) {
        // Handle any errors here
        console.log('Error fetching Stripe API key:', error);
      }
    }
  
    getStripeApiKey();
  }, []);

  const {user, loading} = useSelector(state=> state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className=' container.container-fluid'>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} exact />
            <Route path="/login" element= {<Login />} />
            <Route path="/register" element= {<Register />}/>
            <Route path="/me" element={<ProtectedRoute > <Profile /></ProtectedRoute>} exact />
            <Route path="/me/update" element={<ProtectedRoute > <UpdateProfile  /></ProtectedRoute>} exact />
            <Route path="/password/update" element={<ProtectedRoute > <UpdatePassword  /></ProtectedRoute>} exact />
            <Route path="/password/forgot" element= {<ForgotPassword  />} exact />
            <Route path="/password/reset/:token" element= {<NewPassword  />} exact />
            <Route path="/cart" element={<Cart />} />
            {/* <Route path="/success" element= {<OrderSuccess />} /> */}
            <Route path="/success" element={<ProtectedRoute > <OrderSuccess  /></ProtectedRoute>} exact />

            <Route path="/shipping" element={<ProtectedRoute > <Shipping  /></ProtectedRoute>} exact />
            <Route path="/order/confirm" element={<ProtectedRoute > <ConfirmOrder  /></ProtectedRoute>} exact />
            <Route path="/orders/me" element={<ProtectedRoute > <ListOrders  /></ProtectedRoute>} exact />
            <Route path="/order/:id" element={<ProtectedRoute > <OrderDetails  /></ProtectedRoute>} exact />


            <Route path="/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboards /></ProtectedRoute>} exact />
            <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductsList /></ProtectedRoute>} exact />
            <Route path="/admin/product" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} exact />
            <Route path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} exact />
            <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} exact />
            <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} exact />

            <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} exact />
            <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} exact />
            <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>} exact />
            {stripeApiKey &&
              <Route path="/payment" element={
                <ProtectedRoute >
                    <Elements stripe={loadStripe(stripeApiKey)}>
                        <Payment />
                    </Elements>
                </ProtectedRoute>} />
          }
        </Routes>
        
        </div>
        {!loading && user&& user.role !=='admin' && (
            <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
