import AuthWrapper from 'containers/authWrapper';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function LoginSessionPage() {
    const [searchParams] = useSearchParams();

    useEffect(() => {});

    return (
        <AuthWrapper>
            <h1>Processing ...{searchParams}</h1>
        </AuthWrapper>
    );
}
