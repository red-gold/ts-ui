import React from 'react';
import AuthWrapper from 'containers/authWrapper';
import VerifyCodeForm from 'components/authentication/VerifyCodeForm';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'redux/store';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { PATH_AUTH } from 'routes/paths';
import { Link as RouterLink } from 'react-router-dom';

// material
import { Box, Button, Container, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

const selectUserFromRegisterToken = authorizeSelector.selectUserFromRegisterToken();

// ----------------------------------------------------------------------

export default function EmailVerifyPage() {
    const { t } = useLocales();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { verifyRegisterCode } = useAuth();
    const user = useSelector(selectUserFromRegisterToken);
    return (
        <AuthWrapper>
            <Container sx={{ p: 5 }}>
                <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                    <Typography variant="h3" paragraph>
                        Please check your email!
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        We have emailed a 6-digit confirmation code to <strong>{user.email}</strong>, please enter the
                        code in below box to verify your email.
                    </Typography>
                    <Box sx={{ mt: 5, mb: 3 }}>
                        <VerifyCodeForm
                            verify={verifyRegisterCode}
                            onSuccess={() => {
                                enqueueSnackbar('Verify success', { variant: 'success' });
                                navigate(PATH_AUTH.login);
                            }}
                            onError={(error) => {
                                enqueueSnackbar(error.message, { variant: 'error' });
                            }}
                        />
                    </Box>
                    <Button fullWidth component={RouterLink} to={PATH_AUTH.register} sx={{ mb: 3 }}>
                        {t('emailVerification.back')}
                    </Button>
                </Box>
            </Container>
        </AuthWrapper>
    );
}
