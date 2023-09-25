import{
    LOGIN_REQUEST ,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,

    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,

    LOG_OUT_SUCCESS,
    LOG_OUT_FAIL,

    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,

    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,

    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,

    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,

    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,

    UPDATE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,

    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,

    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,

    CLEAR_ERRORS
} from '../constants/userConstant';

import axios from 'axios';
//login user action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/login', { email, password }, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}


//register user
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const {data}  = await axios.post('/api/v1/register', userData, config)
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: REGISTER_USER_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//load user token with cookie
    export const loadUser = () => async (dispatch) => {
        try {
    
            dispatch({ type: LOAD_USER_REQUEST })
    
            const { data } = await axios.get('/api/v1/me')
    
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: data.user
            })
    
        } catch (error) {
            dispatch({
                type: LOAD_USER_FAIL,
                payload: error.response.data.message
            })
        }
    }


//update  user profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.put('/api/v1/me/update', userData, config)
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: UPDATE_PROFILE_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//update passsword
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.put('/api/v1/password/update', passwords, config)
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: UPDATE_PASSWORD_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.post('/api/v1/password/forgot', email, config)
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: FORGOT_PASSWORD_FAIL,
                payload: error.response.data.message
            })
        }
    }
}


//reset new password in forgot password send email

export const resetPassword = (token, passswords ) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.put(`/api/v1/password/reset/${token}`, passswords, config)
        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success,
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: NEW_PASSWORD_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//logout user
export const logout = () => async (dispatch) => {
    try {
         await axios.get('/api/v1/logout')
        dispatch({
            type: LOG_OUT_SUCCESS,
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: LOG_OUT_FAIL,
                payload: error.response.data.message
            })
        } 
    }
}

//display all user admin acces onlyy
export const allUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.get(`/api/v1/admin/users`)
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        })

    } catch (error) {
        if (error.response) {
            dispatch({
                type: ALL_USERS_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

// update user admin acces only
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data}  = await axios.put(`/api/v1/admin/users/${id}`, userData, config)
        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: UPDATE_USER_FAIL,
                payload: error.response.data.message
            })
        }
    }
}


// getUserDetails by admin
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/users/${id}`)
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.users
        })
    } catch (error) {
        if (error.response) {
            dispatch({
                type: USER_DETAILS_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//delete user by admin /api/v1/admin/
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/users/${id}`)
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        if (error.response) {
            dispatch({
                type: DELETE_USER_FAIL,
                payload: error.response.data.message
            })
        }
    }
}

//clear error
export const clearError = ()=> async (dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS
    })
}