import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import green from '@mui/material/colors/green';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import classnames from 'classnames';
import { LoginUser } from 'core/domain/authorize/loginUser';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { flag } from 'country-emoji';
import Footer from 'oldComponents/footer';
import { AsYouType, isValidNumber } from 'libphonenumber-js';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { provider } from 'socialEngine';
import * as authorizeActions from 'redux/actions/authorizeActions';
import * as globalActions from 'redux/actions/globalActions';
//
import GoogleRecaptcha from 'components/recaptcha/GoogleRecaptcha';
import { AuthorizeState } from 'models/authorize/authorizeState';
import { ISmsVerificationComponentProps } from './ISmsVerificationComponentProps';
import { ISmsVerificationComponentState } from './ISmsVerificationComponentState';
import { SmsVerificationStepType } from './smsVerificationStepType';

const styles = (theme: any) => ({
    textField: {
        minWidth: 280,
        marginTop: 20,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    caption: {
        marginTop: 30,
    },
    formControl: {
        minWidth: 280,
    },
    noDisplay: {
        display: 'none',
    },
    loading: {
        position: 'absolute',
        top: '45%',
        left: '45%',
    },
    contain: {
        margin: '0 auto',
    },
    boxRoot: {
        padding: '20px 40px 36px',
    },
    paper: {
        minHeight: 370,
        maxWidth: 450,
        minWidth: 337,
        textAlign: 'center',
        display: 'block',
        margin: 'auto',
    },
    logoutButton: {
        margin: 8,
    },
    phoneExample: {
        display: 'inline-grid',
        textAlign: 'left',
        fontSize: 11,
        color: 'darkgrey',
    },
});

export class SmsVerificationComponent extends Component<
    ISmsVerificationComponentProps & WithTranslation,
    ISmsVerificationComponentState
> {
    _authorizeService: IAuthorizeService;

    constructor(props: ISmsVerificationComponentProps & WithTranslation) {
        super(props);
        this._authorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);
        this.state = {
            phoneNumber: '',
            phoneNumberError: '',
            code: '',
            codeError: '',
            countryCode: 'vn',
            isNextDisabled: true,
            isVerifyDisabled: true,
            verifyId: '',
            loading: false,
            step: SmsVerificationStepType.EnterPhoneNumber,
            isCaptchaSuccess: false,
            captchaVerifier: null,
        };
        // Binding function to `this`
        this.handleNextPhoneNumber = this.handleNextPhoneNumber.bind(this);
    }

    /**
     * Handle data on input change
     * @param  {event} evt is an event of inputs of element on change
     */
    handleInputChange = (event: any) => {
        const { t } = this.props;
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const asYouType = new AsYouType();
        if (!t) {
            return;
        }
        if (name === 'phoneNumber') {
            let phoneNumberError = '';

            if (value && value.trim() !== '') {
                const arrayValue = value as string;
                if (arrayValue[0] === '0') {
                    phoneNumberError = t('smsVerification.validPhoneNumberError');
                } else {
                    value = arrayValue[0] === '+' ? value : `+${value}`;
                }
            } else {
                phoneNumberError = t('smsVerification.requiredPhoneNumberError');
            }

            const phoneNumber = asYouType.input(value);
            if (value && (value as string).length > 3 && !asYouType.country) {
                phoneNumberError = t('smsVerification.validPhoneNumberError');
            }
            const countryCode = (asYouType.country || 'ir').toLocaleLowerCase();
            this.setState({
                phoneNumber,
                countryCode,
                phoneNumberError,
                isNextDisabled:
                    (phoneNumber !== undefined && phoneNumberError !== '') ||
                    !phoneNumber ||
                    (phoneNumber !== undefined && !isValidNumber(phoneNumber)),
            });
        }

        if (name === 'code') {
            let codeError = '';
            const code = value ? (value as string).trim() : '';
            if (!value || (value && (value as string).trim() === '')) {
                codeError = t('smsVerification.requiredCodeError');
            } else if (value && (value as string).trim().length !== 4) {
                codeError = t('smsVerification.validCodeError');
            }
            this.setState({
                code,
                codeError,
                isVerifyDisabled: codeError !== '',
            });
        }
    };

    /**
     * Handle register form
     */
    handleNextPhoneNumber = () => {
        const { phoneNumber, isCaptchaSuccess, captchaVerifier } = this.state;
        if (phoneNumber && phoneNumber.trim() !== '' && isCaptchaSuccess) {
            this.setState({
                loading: true,
            });
            const { phoneNumber } = this.state;
            this._authorizeService
                .sendSmsVerification(`+${phoneNumber.replace(/\D/g, '')}`, captchaVerifier)
                .then((verifyId: string) => {
                    this.setState({
                        step: SmsVerificationStepType.VerificationCode,
                        verifyId,
                        loading: false,
                    });
                });
        }
    };

    /**
     * Handle success result of solving captcha
     */
    handleSuccessCaptcha = (value: any) => {
        this.setState({
            captchaVerifier: value,
            isCaptchaSuccess: true,
        });
    };

    /**
     * Handle expired captcha
     */
    handleExpiredCaptcha = () => {
        const { showMessage, t } = this.props;
        if (showMessage && t) {
            showMessage(t('smsVerification.capthaExpiredMessage'));
        }
        this.handleReset();
    };

    /**
     * Handle reset sms verification
     */
    handleReset = () => {
        this.setState({
            phoneNumber: '',
            phoneNumberError: '',
            code: '',
            codeError: '',
            loading: false,
            countryCode: 'es',
            isNextDisabled: true,
            isVerifyDisabled: true,
            step: SmsVerificationStepType.EnterPhoneNumber,
        });
    };

    /**
     * Handle verify code
     */
    handleVerifyCode = () => {
        const { code, verifyId, phoneNumber } = this.state;
        const { home, showMessage, login } = this.props;
        this.setState({
            loading: true,
        });
        this._authorizeService
            .confirmVerificationPhone(code, verifyId, `+${phoneNumber.replace(/\D/g, '')}`)
            .then((user: LoginUser) => {
                if (login && home) {
                    login(user);
                    home();
                }
            })
            .catch((error) => {
                if (showMessage) {
                    showMessage(error.message);
                }
                this.handleReset();
            });
    };

    /**
     * Handle error capthcha render
     */
    handleErrorCapthaRender = () => {
        const { showMessage, t } = this.props;
        if (showMessage && t) {
            showMessage(t('smsVerification.capthaRenderErrorMessage'));
        }
        this.handleReset();
    };

    render() {
        const { classes, t, logout } = this.props;
        const {
            phoneNumber,
            countryCode,
            phoneNumberError,
            isNextDisabled,
            step,
            code,
            codeError,
            isVerifyDisabled,
            loading,
            isCaptchaSuccess,
        } = this.state;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.contain}>
                    <div className="animate-bottom">
                        <Paper className={classes.paper} elevation={1}>
                            <div className={classes.boxRoot}>
                                <div
                                    style={{
                                        paddingLeft: '40px',
                                        paddingRight: '40px',
                                    }}
                                >
                                    <h2 className="zoomOutLCorner animated g__paper-title">
                                        {t('smsVerification.title')}
                                    </h2>
                                </div>

                                {/* Phone Number */}
                                <div
                                    className={classnames({
                                        [classes.noDisplay]: step !== SmsVerificationStepType.EnterPhoneNumber,
                                    })}
                                >
                                    <FormControl
                                        className={classes.formControl}
                                        error={phoneNumberError !== ''}
                                        aria-describedby="phone-number-error-text"
                                    >
                                        <InputLabel htmlFor="phone-number">
                                            {t('smsVerification.phoneNumberLabel')}
                                        </InputLabel>
                                        <Input
                                            type={'tel'}
                                            id="phone-number"
                                            value={phoneNumber}
                                            name={'phoneNumber'}
                                            onChange={this.handleInputChange}
                                            autoFocus
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton>{flag(countryCode)}</IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        <FormHelperText id="phone-number-error-text">{phoneNumberError}</FormHelperText>
                                    </FormControl>
                                    <span className={classes.phoneExample}> ex. +34665432110 </span>
                                    <br />
                                    <br />
                                    {/* Recaptcha */}
                                    <GoogleRecaptcha
                                        onSuccess={this.handleSuccessCaptcha}
                                        onExpired={this.handleExpiredCaptcha}
                                        onError={this.handleErrorCapthaRender}
                                    />
                                    <div className="settings__button-box">
                                        <div>
                                            <Button className={classes.logoutButton} onClick={logout}>
                                                {t('smsVerification.logoutButton')}
                                            </Button>
                                        </div>
                                        <div className={classes.wrapper}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.nextButton}
                                                disabled={isNextDisabled || !isCaptchaSuccess || loading}
                                                onClick={this.handleNextPhoneNumber}
                                            >
                                                {t('smsVerification.verifyButton')}{' '}
                                            </Button>
                                            {loading && (
                                                <CircularProgress size={24} className={classes.buttonProgress} />
                                            )}
                                        </div>
                                    </div>
                                    <Typography className={classes.caption} variant="caption" component="p">
                                        {t('smsVerification.phoneNumberDescription')}
                                    </Typography>
                                </div>

                                {/* Verification Code */}
                                <div
                                    className={classnames({
                                        [classes.noDisplay]: step !== SmsVerificationStepType.VerificationCode,
                                    })}
                                >
                                    <FormControl
                                        className={classes.formControl}
                                        error={codeError !== ''}
                                        aria-describedby="code-error-text"
                                    >
                                        <InputLabel htmlFor="code">{t('smsVerification.codeLabel')}</InputLabel>
                                        <Input
                                            type={'tel'}
                                            id="code"
                                            value={code}
                                            name={'code'}
                                            onChange={this.handleInputChange}
                                            autoFocus
                                        />
                                        <FormHelperText id="code-error-text">{codeError}</FormHelperText>
                                    </FormControl>
                                    <br />
                                    <br />
                                    <div className="settings__button-box">
                                        <div>
                                            <Button onClick={logout}>{t('smsVerification.resetButton')}</Button>
                                        </div>
                                        <div>
                                            <div className={classes.wrapper}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.nextButton}
                                                    disabled={isVerifyDisabled || loading}
                                                    onClick={this.handleVerifyCode}
                                                >
                                                    {t('smsVerification.verifyButton')}{' '}
                                                </Button>
                                                {loading && (
                                                    <CircularProgress size={24} className={classes.buttonProgress} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Typography className={classes.caption} variant="caption" component="p">
                                        {t('smsVerification.codeVerifyDescription')}
                                    </Typography>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </Grid>
                <Footer />
            </Grid>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(authorizeActions.dbLogout()),
        home: () => {
            location.href = '/';
        },
        showMessage: (message: string) => dispatch(globalActions.showMessage(message)),
        login: (user: AuthorizeState) => dispatch(authorizeActions.login(user)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SmsVerificationComponent);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles as any)(translateWrapper as any) as any);
