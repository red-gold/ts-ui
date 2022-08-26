import jwtDecode from 'jwt-decode';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';

// ----------------------------------------------------------------------

export interface AccessToken {
    name: string;
    access_token: string;
    organizations: string;
    claim: Claim;
    aud: string;
    exp: number;
    jti: string;
    iat: number;
    iss: string;
    sub: string;
}

export interface Claim {
    displayName: string;
    socialName: string;
    organizations: string;
    avatar: string;
    banner: string;
    tagLine: string;
    uid: string;
    email: string;
    createdDate: number;
    role: string;
}

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
    if (!accessToken) {
        return false;
    }
    const decoded = jwtDecode<AccessToken>(accessToken);

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};

const handleTokenExpired = (exp: number) => {
    let expiredTimer;

    const currentTime = Date.now();

    // Test token expires after 10s
    // const timeLeft = currentTime + 10000 - currentTime; // ~10s
    const timeLeft = exp * 1000 - currentTime;

    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(() => {
        // eslint-disable-next-line no-alert
        alert('Token expired');

        localStorage.removeItem('accessToken');

        window.location.href = PATH_AUTH.login;
    }, timeLeft);
};

const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // This function below will handle when token is expired
        const { exp } = jwtDecode<AccessToken>(accessToken);
        handleTokenExpired(exp);
    } else {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

export { isValidToken, setSession };
