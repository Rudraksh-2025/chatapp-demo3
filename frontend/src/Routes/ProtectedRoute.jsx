import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Outlet, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
    const { isCheckingAuth, checkAuth, appToken, createSession, userToken } = useAuthStore();

    useEffect(() => {
        if (!appToken) {
            createSession();
        }
        checkAuth();
    }, []);

    if (isCheckingAuth) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={40} color='black' />
                <div>Loading....</div>
            </Box>
        );
    }

    if (!userToken) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
