import React from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'react-loadable';
import { PartialRouteObject } from 'react-router';
import { MasterLoadingComponent } from 'components/masterLoading';
import { homeRoutes } from './homeRouter';

const AsyncSignup = Loadable({
    loader: () => import('containers/signupWrapper'),
    loading: MasterLoadingComponent,
});
const AsyncEmailVerification = Loadable({
    loader: () => import('containers/emailVerification'),
    loading: MasterLoadingComponent,
});
const AsyncResetPassword = Loadable({
    loader: () => import('containers/resetPassword'),
    loading: MasterLoadingComponent,
});
const AsyncLogin = Loadable({
    loader: () => import('containers/loginWrapper'),
    loading: MasterLoadingComponent,
});

const AsyncTerms = Loadable({
    loader: () => import('containers/terms'),
    loading: MasterLoadingComponent,
});
const AsyncSmsVerification = Loadable({
    loader: () => import('containers/smsVerification'),
    loading: MasterLoadingComponent,
});
const AsyncNewPassword = Loadable({
    loader: () => import('containers/newPassword'),
    loading: MasterLoadingComponent,
});

const AsyncMaster: any = Loadable({
    loader: () => import('containers/master'),
    loading: MasterLoadingComponent,
});

const routes = (isLoggedIn: boolean) => [
    {
        path: '/signup',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncSignup />,
    },
    {
        path: '/emailVerification',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncEmailVerification />,
    },
    {
        path: '/smsVerification',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncSmsVerification />,
    },
    {
        path: '/resetPassword',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncResetPassword />,
    },
    {
        path: '/terms',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncTerms />,
    },
    {
        path: '/login',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncLogin />,
    },
    {
        path: '/newPassword',
        element: isLoggedIn ? <Navigate to="/" /> : <AsyncNewPassword />,
    },
    {
        path: '/',
        element: isLoggedIn ? <AsyncMaster /> : <Navigate to="/login" replace />,
        children: homeRoutes as PartialRouteObject[],
    },
];

export default routes;
