import React from 'react';
import AuthWrapper from 'containers/authWrapper';
import SignupComponent from '../components/authentication/SignupForm';

// ----------------------------------------------------------------------

export default function SignupPage() {
    return (
        <AuthWrapper>
            {' '}
            <SignupComponent />{' '}
        </AuthWrapper>
    );
}
