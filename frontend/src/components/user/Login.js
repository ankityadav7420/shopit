import React, { Fragment, useState, useEffect } from 'react'
// import {useAlert} from 'react-loader'   //TO DO
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {login, clearError} from '../../actions/userActions'
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData'

const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setpassword] = useState('')
    // const alert = useAlert()
    const dispatch =useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, error, loading} = useSelector(state=>state.auth);

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
        }
        if(error){
            const alert=alert(error);
            dispatch(clearError);
        }
    },[dispatch, alert,isAuthenticated,navigate, error, loading])

    //handeling form submit for login
    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch(login(email,password));
    }
  return (
    <Fragment>
        {loading ? <Loader />:(
            <Fragment>
                <MetaData title={`ShopIT: login`} />
                    <div className="row wrapper"> 
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                                </div>
            
                                <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className="form-control"
                                    value={password}
                                    onChange={(e)=>setpassword(e.target.value)}
                                />
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
            
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                LOGIN
                                </button>

                            <Link to="/register" className="float-right mt-3">New User?</Link>
                    </form>
                    </div>
                </div>
            </Fragment>
        )}
    </Fragment> 
  ) 
}

export default Login