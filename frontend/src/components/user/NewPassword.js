import React, { Fragment, useState, useEffect } from 'react'
// import {useAlert} from 'react-loader'   //TO DO
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {resetPassword, clearError} from '../../actions/userActions'
import MetaData from '../layout/MetaData'


//resetting password and sending email
const NewPassword = () => {
    const [password, setPassword]= useState('')
    const [confirmPassword, setConfirmPassword]= useState('')

    // const alert = useAlert()
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { error, success, message, loading } = useSelector(state => state.forgotPassword)

    useEffect(()=>{
        if(error){
            // const alert=alert(error);
            dispatch(clearError);
            alert(error)
        }
        if(success){
            alert(message, success)
            navigate('/login');
        }

    },[dispatch, error, navigate, message, success])

    //submit handler
    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        dispatch(resetPassword(params.token, formData))
    }
    return (
        <Fragment>

            <MetaData title={'New Password Reset'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false} >
                            Set Password
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default NewPassword