import React from 'react';
import AuthWrapper from 'containers/authWrapper';
import ResetPasswordForm from 'components/authentication/ResetPasswordForm';

export default function ResetPasswordPage() {
    return (
        <AuthWrapper>
            <ResetPasswordForm />
        </AuthWrapper>
    );
}
