import React, {useEffect} from 'react';
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

function App() {

  useEffect(()=>{
    store.dispatch(loadUser);
  },[])

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
        </Routes>
        </div>

        <Footer /> 
      </div>
    </Router>
  );
}

export default App;