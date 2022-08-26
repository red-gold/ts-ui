import React from 'react';
import AuthWrapper from 'containers/authWrapper';
import LoginForm from '../components/authentication/LoginForm';

export default function LoginPage() {
    return (
        <AuthWrapper>
            <LoginForm />
        </AuthWrapper>
    );
}
