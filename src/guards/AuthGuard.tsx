import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// hooks
import LoginPage from 'pages/LoginPage';
import useAuth from '../hooks/useAuth';
// pages

// ----------------------------------------------------------------------

export interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useAuth();
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState('');

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <LoginPage />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation('');
        return <Navigate to={requestedLocation} />;
    }

    return <>{children}</>;
}
