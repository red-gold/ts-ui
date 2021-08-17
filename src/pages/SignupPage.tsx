import React from 'react';
import SignupComponent from '../components/authentication/SignupForm';
import AuthWrapper from 'containers/authWrapper';

// ----------------------------------------------------------------------

export default function SignupPage() {
    return (
        <AuthWrapper>
            {' '}
            <SignupComponent />{' '}
        </AuthWrapper>
    );
}
