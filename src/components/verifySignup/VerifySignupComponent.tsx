// - Import react components
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import * as authorizeActions from 'store/actions/authorizeActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

import { IVerifySignupProps } from './IVerifySignupProps';
import { IVerifySignupState } from './IVerifySignupState';
import { verifySignupStyles } from './verifySignupStyles';

// - Components

// - Import actions
// - Import app API
// - Create Verify Signup component class
export class VerifySignupComponent extends Component<IVerifySignupProps & WithTranslation, IVerifySignupState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IVerifySignupProps & WithTranslation) {
        super(props);

        this.state = {
            code: '',
            codeError: '',
        };
        // Binding function to `this`
        this.handleForm = this.handleForm.bind(this);
    }

    /**
     * Handle data on input change
     * @param  {event} evt is an event of inputs of element on change
     */
    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        });

        switch (name) {
            case 'code':
                this.setState({
                    codeError: '',
                });
                break;
            default:
        }
    };

    /**
     * Handle register form
     */
    handleForm = () => {
        const { code } = this.state;
        const { verify, t } = this.props;
        if (code && code.trim() === '') {
            this.setState({
                codeError: t('signup.codeRequiredError'),
            });
        } else if (code.length !== 4 && t) {
            this.setState({
                codeError: t('signup.codeNumberOfDigitsError'),
            });
        } else if (verify) {
            verify(code);
        }
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { classes, t, signupRequest } = this.props;
        const { code } = this.state;
        if (!signupRequest) {
            return <div />;
        }
        const signupRequestId = StringAPI.createServerRequestId(ServerRequestType.AuthSignup, code);
        const signupRequestStatus = signupRequest.get(signupRequestId, { status: ServerRequestStatusType.NoAction })
            .status;
        const loading = signupRequestStatus === ServerRequestStatusType.Sent;
        return (
            <div className={classes.root}>
                <TextField
                    className={classes.textField}
                    autoFocus
                    color="secondary"
                    disabled={loading}
                    onChange={this.handleInputChange}
                    helperText={this.state.codeError}
                    error={this.state.codeError.trim() !== ''}
                    name="code"
                    label={t('signup.codeLabel')}
                    type="text"
                />
                <br />

                <div style={{ height: 30 }} />

                <br />
                <div className={classes.signupButtonRoot}>
                    <div className={classes.wrapperButton}>
                        <Button
                            variant="contained"
                            className={classes.signupButton}
                            color="secondary"
                            disabled={loading}
                            onClick={this.handleForm}
                            fullWidth
                            tabIndex={3}
                        >
                            {t('signup.verifyButton')}
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </div>
                <Typography className={classes.caption} variant="caption" component="p">
                    {t('signup.termCaption')} <NavLink to="/terms"> {t('signup.termCaptionLink')} </NavLink>
                </Typography>
                <Divider />
                <div>
                    <span className={classes.bottomPaper}>
                        {t('login.loginText')}{' '}
                        <NavLink to="/login" className={classes.link}>
                            {t('login.loginButton')}
                        </NavLink>
                    </span>
                </div>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        showError: (message: string) => {
            dispatch(globalActions.showMessage(message));
        },
        verify: (code: string) => {
            dispatch(authorizeActions.asyncVerifyUserRegisterCode(code));
        },
        loginPage: () => {
            dispatch(push('/login'));
        },
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => {
    const signupRequest = state.getIn(['server', 'request'], Map({}));
    return {
        signupRequest,
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(VerifySignupComponent);

export default withRouter(
    connect<{}, {}, any, any>(
        mapStateToProps,
        mapDispatchToProps,
    )(withStyles(verifySignupStyles as any)(translateWrapper as any) as any) as any,
);
