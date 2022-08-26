import React from 'react';
import * as Yup from 'yup';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { Form, FormikProvider, useFormik } from 'formik';
import { PATH_AUTH } from 'routes/paths';
// material
import { Alert, IconButton, Stack, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { LoadingButton } from '@mui/lab';
//
import GoogleRecaptcha from 'components/recaptcha/GoogleRecaptcha';
import PasswordStrengthBar from 'react-password-strength-bar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    padding: '20px 40px 36px',
    [theme.breakpoints.down('xs')]: {
        padding: '0px 40px 36px',
    },
}));

const TermStyle = styled(Typography)(() => ({
    marginTop: 30,
    marginBottom: 15,
}));

const BottomPaperStyle = styled('span')(() => ({
    display: 'inherit',
    fontSize: 'small',
    marginTop: '25px',
    marginBottom: 15,
}));

const LoginLinkStyle = styled(NavLink)(({ theme }) => ({
    color: theme.palette.primary.main,
    display: 'inline-block',
}));

// ----------------------------------------------------------------------

export default function SignupComponent() {
    const { fetchRegisterToken } = useAuth();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useLocales();

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.firstNameRequired')),
        lastName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.lastNameRequired')),
        email: Yup.string().email(t('signup.emailNotValid')).required(t('signup.emailRequired')),
        password: Yup.string().required(t('signup.passwordRequired')),
        recaptchVerifier: Yup.string().required(t('signup.verifyRecaptcha')),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            recaptchVerifier: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                await fetchRegisterToken(
                    values.email,
                    values.password,
                    values.firstName,
                    values.lastName,
                    values.recaptchVerifier,
                );
                navigate(PATH_AUTH.verifySignup);
                enqueueSnackbar('Register success', {
                    variant: 'success',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseIcon />
                        </IconButton>
                    ),
                });
                if (isMountedRef.current) {
                    setSubmitting(false);
                }
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.error(error);
                if (isMountedRef.current) {
                    const errors = { afterSubmit: error.message };
                    setStatus(errors);
                    setSubmitting(false);
                }
            }
        },
    });

    const { touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
    const errors = formik.errors as any;
    /**
     * Handle success result of solving captcha
     */
    const handleSuccessRecaptcha = (recaptchVerifier: string | null) => {
        if (!recaptchVerifier) {
            enqueueSnackbar('Recaptcha returned null token!', {
                variant: 'error',
            });
            return;
        }
        setFieldValue('recaptchVerifier', recaptchVerifier);
    };

    /**
     * Handle expired captcha
     */
    const handleExpiredRecaptcha = () => {
        enqueueSnackbar(t('resetPassword.capthaExpiredMessage'), {
            variant: 'error',
        });
    };

    /**
     * Handle error capthcha render
     */
    const handleErrorRecaptcha = () => {
        enqueueSnackbar(t('resetPassword.capthaRenderErrorMessage'), {
            variant: 'error',
        });
    };

    return (
        <RootStyle>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label={t('signup.firstName')}
                                {...getFieldProps('firstName')}
                                error={Boolean(touched.firstName && errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                            />

                            <TextField
                                fullWidth
                                label={t('signup.lastName')}
                                {...getFieldProps('lastName')}
                                error={Boolean(touched.lastName && errors.lastName)}
                                helperText={touched.lastName && errors.lastName}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            autoComplete="username"
                            type="email"
                            label={t('signup.emailLabel')}
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                        />

                        <TextField
                            fullWidth
                            autoComplete="current-password"
                            label={t('signup.passwordLabel')}
                            {...getFieldProps('password')}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <PasswordStrengthBar minLength={6} password={getFieldProps('password').value} />
                        <GoogleRecaptcha
                            onExpired={handleExpiredRecaptcha}
                            onError={handleErrorRecaptcha}
                            onSuccess={handleSuccessRecaptcha}
                        />

                        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                            {t('signup.createButton')}
                        </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>

            <TermStyle variant="caption">
                {t('signup.termCaption')}{' '}
                <NavLink to="/terms">
                    {' '}
                    <>{t('signup.termCaptionLink')}</>{' '}
                </NavLink>
            </TermStyle>
            <Divider />
            <div>
                <BottomPaperStyle>
                    {t('login.loginText')} <LoginLinkStyle to="/login">{t('login.loginButton')}</LoginLinkStyle>
                </BottomPaperStyle>
            </div>
        </RootStyle>
    );
}
