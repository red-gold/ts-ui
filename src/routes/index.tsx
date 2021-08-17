import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import { useLocation, useRoutes } from 'react-router';
import Page404 from 'pages/Page404';
import GuestGuard from 'guards/GuestGuard';
import AuthGuard from 'guards/AuthGuard';
import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';
import LoadingScreen from 'components/LoadingScreen';

const Loadable = (Component: React.ComponentType) => (props: any) => {
    const { pathname } = useLocation();
    const isDashboard =
        !pathname.includes('/auth') &&
        !pathname.includes('/404') &&
        !pathname.includes('/505') &&
        !pathname.includes('/maintenance');
    return (
        <Suspense
            fallback={
                <LoadingScreen
                    sx={{
                        ...(!isDashboard && {
                            top: 0,
                            left: 0,
                            width: 1,
                            zIndex: 9999,
                            position: 'fixed',
                        }),
                        color: '#fff',
                        zIndex: (theme: any) => theme.zIndex.drawer + 1,
                    }}
                />
            }
        >
            <Component {...props} />
        </Suspense>
    );
};
// - Async Components
const AsyncStream = Loadable(lazy(() => import('pages/StreamPage')));
const AsyncProfile = Loadable(lazy(() => import('pages/ProfilePage')));
const AsyncPostPage = Loadable(lazy(() => import('pages/PostPage')));
const AsyncPeople = Loadable(lazy(() => import('pages/FindFriendsPage')));
const AsyncSearch = Loadable(lazy(() => import('pages/SearchPage')));
const AsyncSupport = Loadable(lazy(() => import('pages/SupportPage')));

const AsyncSetting = Loadable(lazy(() => import('pages/AccountPage')));

// other page
const AsyncSignup = Loadable(lazy(() => import('pages/SignupPage')));
const AsyncEmailVerification = Loadable(lazy(() => import('pages/EmailVerifyPage')));
const AsyncResetPassword = Loadable(lazy(() => import('pages/ResetPasswordPage')));
const AsyncLogin = Loadable(lazy(() => import('pages/LoginPage')));

export default function Router() {
    return useRoutes([
        // authenticated routes
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <AsyncLogin />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'register',
                    element: (
                        <GuestGuard>
                            <AsyncSignup />
                        </GuestGuard>
                    ),
                },
                { path: 'login-unprotected', element: <AsyncLogin /> },
                { path: 'register-unprotected', element: <AsyncSignup /> },
                { path: 'reset-password', element: <AsyncResetPassword /> },
                { path: 'verify-signup', element: <AsyncEmailVerification /> },
            ],
        },

        // dashboard routes
        {
            path: '/',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: '/',
                    element: <Navigate to="/stream" />,
                },
                { path: 'stream', element: <AsyncStream /> },
                { path: 'friends', element: <AsyncPeople /> },
                { path: 'friends/:tab', element: <AsyncPeople /> },
                { path: '@/:socialName', element: <AsyncProfile /> },
                { path: 'account', element: <AsyncSetting /> },
                { path: 'search/:category', element: <AsyncSearch /> },
                { path: 'posts/:urlKey', element: <AsyncPostPage /> },
                { path: 'support', element: <AsyncSupport /> },
            ],
        },

        {
            path: '*',
            element: <LogoOnlyLayout />,
            children: [
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}
