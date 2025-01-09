import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
    const { createSession, appToken, userToken } = useAuthStore();

    useEffect(() => {
        if (!appToken) {
            createSession();
        }
    }, []);

    if (userToken) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default AuthLayout;