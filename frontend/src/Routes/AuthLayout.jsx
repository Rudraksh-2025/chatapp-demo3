import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
    const { authUser, createSession, appToken } = useAuthStore();

    useEffect(() => {
        if (!appToken) {
            createSession();
        }
    }, []);

    if (authUser) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default AuthLayout;