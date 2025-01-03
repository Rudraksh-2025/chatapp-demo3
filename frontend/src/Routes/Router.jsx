import { createBrowserRouter } from 'react-router-dom';
import Signup from '../Pages/Login/Signup';
import Login from '../Pages/Login/Login';
import AuthLayout from './AuthLayout';
import Chat from '../Pages/Chat/Chat'
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            { path: '/', element: <Chat /> },
        ],
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
        ],
    },
]);
