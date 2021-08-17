import React from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { styled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { LoadingButton } from '@material-ui/lab';

//
import { NavLink } from 'react-router-dom';
import config from 'config';
import { OAuthType } from 'core/domain/authorize/oauthType';
import * as authorizeActions from 'redux/actions/authorizeActions';
import CloseIcon from '@material-ui/icons/CloseRounded';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack5';
import useLocales from 'hooks/useLocales';
import { useDispatch } from 'redux/store';
import { PATH_AUTH } from 'routes/paths';

// ----------------------------------------------------------------------

const OAuthRootStyle = styled('div')(() => ({
    paddingBottom: 10,
    justifyContent: 'space-around',
    display: 'flex',
}));

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

const FormRootStyle = styled('div')(({ theme }) => ({
    padding: '48px 40px 36px',
    [theme.breakpoints.down('xs')]: {
        padding: '0px 40px 36px',
    },
}));

const ButtonBoxStyle = styled('div')(() => ({
    margin: 0,
    border: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    minWidth: 0,
    flexDirection: 'column',
}));

const WrapperButtonStyle = styled('div')(() => ({
    position: 'relative',
    width: '100%',
    maxWidth: 280,
    minWidth: 280,
}));

const BottomPaperStyle = styled('span')(() => ({
    display: 'inherit',
    fontSize: 'small',
    marginTop: '25px',
    marginBottom: 15,
}));

const SignupLinkStyle = styled(NavLink)(({ theme }) => ({
    color: theme.palette.primary.main,
    display: 'inline-block',
}));

const ForgotLinkStyle = styled(NavLink)(() => ({
    fontSize: 11,
}));

const OAuthIconStyle = styled('div')(() => ({}));

// ----------------------------------------------------------------------

export default function LoginForm() {
    const { login } = useAuth();
    const { t } = useLocales();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const loginWithOAuth = (type: OAuthType) => dispatch(authorizeActions.dbLoginWithOAuth(type));

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email(t('login.emailNotVelid')).required(t('login.emailRequiredError')),
        password: Yup.string().required(t('login.passwordRequiredError')),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: true,
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
            try {
                await login(values.email, values.password);
                enqueueSnackbar('Login success', {
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
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                resetForm();
                if (isMountedRef.current) {
                    setSubmitting(false);
                    const errors = {};
                    errors['afterSubmit'] = error.message;
                    setErrors(errors);
                }
            }
        },
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    const OAuthLogin = (
        <OAuthRootStyle>
            <IconButton onClick={() => loginWithOAuth(OAuthType.GITHUB)}>
                {' '}
                <OAuthIconStyle className="icon-github icon"></OAuthIconStyle>{' '}
            </IconButton>
            <IconButton disabled onClick={() => loginWithOAuth(OAuthType.FACEBOOK)}>
                <OAuthIconStyle sx={{ opacity: 0.2 }} className="icon-fb icon"></OAuthIconStyle>
            </IconButton>
            <IconButton disabled onClick={() => loginWithOAuth(OAuthType.GOOGLE)}>
                {' '}
                <OAuthIconStyle sx={{ opacity: 0.2 }} className="icon-google icon"></OAuthIconStyle>{' '}
            </IconButton>
        </OAuthRootStyle>
    );

    return (
        <FormikProvider value={formik}>
            <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FormRootStyle>
                    {config.settings.enabledOAuthLogin ? OAuthLogin : ''}
                    <Divider />
                    <TextField
                        color="secondary"
                        sx={{ minWidth: 280, marginTop: 5 }}
                        autoComplete="username"
                        type="email"
                        label={t('login.emailLabel')}
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        tabIndex={1}
                    />
                    <br />
                    <TextField
                        color="secondary"
                        sx={{ minWidth: 280, marginTop: 5 }}
                        autoComplete="current-password"
                        type={'password'}
                        {...getFieldProps('password')}
                        label={t('login.passwordLabel')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        tabIndex={2}
                    />
                    <br />
                    <br />
                    <ButtonBoxStyle>
                        <WrapperButtonStyle>
                            <LoadingButton
                                tabIndex={3}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                {t('login.loginButton')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </ButtonBoxStyle>
                    <BottomPaperStyle>
                        <ForgotLinkStyle to="/resetPassword">{t('login.forgetPasswordMessage')}</ForgotLinkStyle>
                    </BottomPaperStyle>
                    <Divider />
                    <BottomPaperStyle>
                        {t('login.createAccountText')}{' '}
                        <SignupLinkStyle to={PATH_AUTH.register}>{t('login.createAccountButton')}</SignupLinkStyle>
                    </BottomPaperStyle>
                </FormRootStyle>
            </FormStyle>
        </FormikProvider>
    );
}
