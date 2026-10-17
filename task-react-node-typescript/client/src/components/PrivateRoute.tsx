import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

/**
 * Wraps protected routes — redirects to /login if the user is not authenticated.
 * Uses <Outlet /> so it works with nested <Route> declarations.
 */
const PrivateRoute = () => {
  const isAuthenticated = useAppSelector((s) => s.student.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
