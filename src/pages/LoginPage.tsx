import React from 'react';
import LoginForm from '../components/authentication/LoginForm';
import AuthWrapper from 'containers/authWrapper';

export default function LoginPage() {
    return (
        <AuthWrapper>
            <LoginForm />
        </AuthWrapper>
    );
}
