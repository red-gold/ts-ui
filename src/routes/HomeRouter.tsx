import React from 'react';
import MasterLoadingComponent from 'components/masterLoading';
import Loadable from 'react-loadable';

// - Async Components
const AsyncStream = Loadable({
    loader: () => import('containers/stream'),
    loading: MasterLoadingComponent,
});
const AsyncProfile = Loadable({
    loader: () => import('containers/profile'),
    loading: MasterLoadingComponent,
});
const AsyncPostPage = Loadable({
    loader: () => import('containers/postPage'),
    loading: MasterLoadingComponent,
});
const AsyncPeople = Loadable({
    loader: () => import('containers/people'),
    loading: MasterLoadingComponent,
});
const AsyncSearchUser = Loadable({
    loader: () => import('containers/searchUser'),
    loading: MasterLoadingComponent,
});
const AsyncSearchPost = Loadable({
    loader: () => import('containers/searchPost'),
    loading: MasterLoadingComponent,
});
const AsyncSearch = Loadable({
    loader: () => import('containers/search'),
    loading: MasterLoadingComponent,
});
const AsyncPhotoMaster = Loadable({
    loader: () => import('containers/photoMaster'),
    loading: MasterLoadingComponent,
});
const AsyncCompany = Loadable({
    loader: () => import('containers/company'),
    loading: MasterLoadingComponent,
});
const AsyncSupport = Loadable({
    loader: () => import('containers/support'),
    loading: MasterLoadingComponent,
});

const AsyncSetting = Loadable({
    loader: () => import('containers/config'),
    loading: MasterLoadingComponent,
});

/**
 * Routes
 */
export const homeRoutes = [
    {
        path: '/settings',
        element: <AsyncSetting />,
    },
    {
        path: '/people/:tab?',
        element: <AsyncPeople />,
    },
    {
        path: '/people/*',
        element: <AsyncPeople />,
    },
    {
        path: '/tag/:tag',
        element: <AsyncStream />,
    },
    {
        path: '/:userId/posts/:postId/:tag?',
        element: <AsyncPostPage />,
    },
    {
        path: '/:userId/posts/:postId',
        element: <AsyncPostPage />,
    },
    {
        path: '/search/post',
        element: <AsyncSearchPost />,
    },
    {
        path: '/company',
        element: <AsyncCompany />,
    },
    {
        path: '/support',
        element: <AsyncSupport />,
    },
    {
        path: '/u/:userId/album/:albumId',
        element: <AsyncPhotoMaster />,
    },
    {
        path: '/search/user',
        element: <AsyncSearchUser />,
    },
    {
        path: '/search',
        element: <AsyncSearch />,
    },
    {
        path: '/:userId',
        element: <AsyncProfile />,
    },
    {
        path: '/',
        element: <AsyncStream />,
    },
];
