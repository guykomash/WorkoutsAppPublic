import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import jwtDecode from 'jwt-decode';

const RequireAuth = ({ logoutNavTo, allowedRoles }) => {
  const { auth } = useAuth();
  let roles = [];
  try {
    roles = jwtDecode(auth?.accessToken)?.UserInfo?.roles;
  } catch (err) {
    // console.log(err);
    roles = [];
  }
  return roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to={logoutNavTo} />
  );
};

export default RequireAuth;
