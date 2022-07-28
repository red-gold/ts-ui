// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_MAIN = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    register: path(ROOTS_AUTH, '/register'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    verifySignup: path(ROOTS_AUTH, '/verify-signup'),
};

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    pricing: '/pricing',
    payment: '/payment',
    about: '/about-us',
    contact: '/contact-us',
    faqs: '/faqs',
    page404: '/404',
    page500: '/500',
    components: '/components',
};
export const PATH_MAIN = {
    root: ROOTS_MAIN,
    user: {
        home: path(ROOTS_MAIN, 'stream'),
        friends: path(ROOTS_MAIN, 'friends'),
        friendsTab: path(ROOTS_MAIN, 'friends/:tab'),
        profile: path(ROOTS_MAIN, '@/:socialName'),
        account: path(ROOTS_MAIN, 'account'),
    },
    search: {
        root: path(ROOTS_MAIN, '/search/:category'),
    },
    support: path(ROOTS_MAIN, '/support'),
};

export const PATH_DOCS = 'https://telar.dev/docs/start/introduction';
