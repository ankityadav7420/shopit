import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadUser } from '../../actions/userActions';

const ProtectedRoute = ({ children, isAdmin, component: Component, ...rest }) => {
  const navigate = useNavigate();
  const { isAuthenticated = false, loading = true, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
        dispatch(loadUser());
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="bg-secondary text-white min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h1 className="m-2">
            Login first to access this resource, go to{' '}
            <Link to="/login" className="text-warning">
              login
            </Link>
          </h1>
        </div>
      </div>
    );
  }

  if (!loading && isAuthenticated) {
if (isAdmin === true && user?.role !== 'admin') {
    navigate('/');
    return null; 
}
return children;
  } else {
    navigate('/login');
    return null;
  }
};

export default ProtectedRoute;
