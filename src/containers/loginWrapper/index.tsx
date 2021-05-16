import { withStyles } from '@material-ui/core/styles';
import config from 'config';
// import classNames from 'classnames';
// import Footer from 'layouts/footer';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// import config from 'config';

// import LoginComponent from '../login';
import { ILoginWrapperProps } from './ILoginWrapperProps';
import { ILoginWrapperState } from './ILoginWrapperState';
import { loginWrapperStyles } from './loginWrapperStyles';

export class LoginWrapperComponent extends Component<ILoginWrapperProps & WithTranslation, ILoginWrapperState> {
    /**
     * Component constructor
     */
    constructor(props: ILoginWrapperProps & WithTranslation) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.location.href = config.gateway.auth_web_uri + '/login';
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {/* <div className={classes.appbar}>
                    <img src={config.settings.logo} alt={config.settings.appName} className={classes.logo} />
                </div>
                <div className={classes.pageContainer}>
                    <div className={classNames(classes.centerRoot, 'animate-bottom')}>
                        <div className={classes.centerContainer}>
                            <div className={classNames(classes.contain, classes.pageItem)}>
                                <LoginComponent />
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 30 }}></div>
                    <Footer />
                </div> */}
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {
        signupPage: () => {
            location.href = '/signup';
        },
    };
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(LoginWrapperComponent);
const styleWrapper = withStyles(loginWrapperStyles as any, { withTheme: true })(translateWrapper as any);
export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(styleWrapper as any);
