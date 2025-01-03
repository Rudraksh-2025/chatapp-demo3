import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    const { authUser, isCheckingAuth, checkAuth, appToken, createSession } = useAuthStore();

    useEffect(() => {
        if (!appToken) {
            createSession();
        }
        checkAuth();
    }, []);

    if (isCheckingAuth) {
        return <div>Loading...</div>;
    }

    if (!authUser) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
