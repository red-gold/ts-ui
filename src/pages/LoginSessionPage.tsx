import AuthWrapper from 'containers/authWrapper';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { setSession } from 'utils/jwt';

export default function LoginSessionPage() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const redirectURL = searchParams.get('r') || document.domain;
        if (accessToken) {
            setSession(accessToken);
        }
        window.location.replace(redirectURL);
    }, [searchParams]);

    return <AuthWrapper children={undefined} />;
}
