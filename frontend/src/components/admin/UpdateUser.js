import React, { Fragment, useState, useEffect } from 'react'
// import {useAlert} from 'react-loader'   //TO DO
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser, getUserDetails, clearError} from '../../actions/userActions'
import MetaData from '../layout/MetaData'
import {UPDATE_USER_RESET} from '../../constants/userConstant'
import Sidebar from './Sidebar';

const UpdateUser = () => {
    const [email, setEmail] = useState('')
    const [name, setName]= useState('')
    const [role, setRole]= useState('')

    // const alert = useAlert()
    const navigate = useNavigate();
    const params = useParams()
    const dispatch = useDispatch();

    const { error, isUpdated } = useSelector(state => state.user);
    const { user } = useSelector(state => state.userDetails)

    const userId = params.id;

    useEffect(()=>{
        if(user && user._id !== userId){
            dispatch(getUserDetails(userId))
        }else{
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }
        if(error){
            // const alert=alert(error);
            dispatch(clearError);
            alert(error)
        }
        if(isUpdated){
            navigate('/admin/users');
            alert('user updated succesfully')
            dispatch({ type: UPDATE_USER_RESET })
        }

    },[dispatch, navigate, error, isUpdated, user, userId])

    //submit handler
    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);
        dispatch(updateUser(user._id, formData))
    }

  return (
    <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-5">Update User</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        name='name'
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        name='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>

                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
  )
}

export default UpdateUser