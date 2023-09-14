import React, { Children, Fragment, useEffect } from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {Route, redirect,useNavigate} from 'react-router-dom'
import { loadUser } from '../../actions/userActions'
import {Navigator} from 'react-redux'
//redirection not working
const ProtectedRoute =({children, isAdmin})=>{

    const navigate= useNavigate();
    const {isAuthenticated=false, loading=true, user} = useSelector(state=>state.auth)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!user){
            dispatch(loadUser())
        }
    },[isAuthenticated,loading])

    if(loading) return <h1>Loading...</h1>
    if(!loading && isAuthenticated){
        if(isAdmin === true && user.role !== 'admin'){
            return  navigate('/')
        } 
        return children;
    }else{
        return navigate('/login')
    }
}

export default ProtectedRoute