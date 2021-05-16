import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Map } from 'immutable';
import Footer from 'layouts/footer';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import VerifySignupComponent from 'components/verifySignup/VerifySignupComponent';
import config from 'config';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

import SignupComponent from '../signup';
import { ISignupWrapperProps } from './ISignupWrapperProps';
import { ISignupWrapperState } from './ISignupWrapperState';
import { signupWrapperStyles } from './signupWrapperStyles';

export class SignupWrapperComponent extends Component<ISignupWrapperProps & WithTranslation, ISignupWrapperState> {
    /**
     * Component constructor
     */
    constructor(props: ISignupWrapperProps & WithTranslation) {
        super(props);
        this.state = {};
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, currentStep } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.appbar}>
                    <img src={config.settings.logo} alt={config.settings.appName} className={classes.logo} />
                </div>
                <div className={classes.pageContainer}>
                    <div className={classNames(classes.centerRoot, 'animate-bottom')}>
                        <div className={classes.centerContainer}>
                            <div className={classNames(classes.contain, classes.pageItem)}>
                                {currentStep === 0 ? <SignupComponent /> : <VerifySignupComponent />}
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 130 }}></div>
                    <Footer />
                </div>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {
        loginPage: () => {
            location.href = '/login';
        },
    };
};

const makeMapStateToProps = () => {
    const selectSignupStep = authorizeSelector.selectSignupStep();
    const mapStateToProps = (state: Map<string, any>) => {
        return {
            currentStep: selectSignupStep(state),
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SignupWrapperComponent);

export default connect<{}, {}, any, any>(
    makeMapStateToProps,
    mapDispatchToProps,
)(withStyles(signupWrapperStyles as any, { withTheme: true })(translateWrapper as any) as any);
