
import { selectIsTokenExpired } from '@/store/authSelectors';
import { clearUserInfo } from '@/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
    redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = '/' }: ProtectedRouteProps) => {
    const isExpired = useSelector(selectIsTokenExpired);
    const dispatch = useDispatch();

    if (isExpired) {
        dispatch(clearUserInfo());
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;