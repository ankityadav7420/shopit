import React, { Fragment, useState, useEffect } from 'react'
// import {useAlert} from 'react-loader'   //TO DO
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {updatePassword, clearError} from '../../actions/userActions'
import MetaData from '../layout/MetaData'
import {UPDATE_PASSWORD_RESET} from '../../constants/userConstant'

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword]= useState('')

    // const alert = useAlert()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user)

    useEffect(()=>{
        if(error){
            // const alert=alert(error);
            dispatch(clearError);
            alert(error)
        }
        if(isUpdated){
            alert('password updated succesfully')
            navigate('/me');
            dispatch({
                type:UPDATE_PASSWORD_RESET
            })
        }

    },[dispatch, navigate, error, isUpdated])

    //submit handler
    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);
        dispatch(updatePassword(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Change Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false} >Update Password</button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdatePassword