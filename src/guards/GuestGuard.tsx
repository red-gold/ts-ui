import React from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_MAIN } from '../routes/paths';

// ----------------------------------------------------------------------

export interface GuestGuardProps {
    children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={PATH_MAIN.root} />;
    }

    return <>{children}</>;
}
