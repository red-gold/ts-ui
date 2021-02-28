// - Import react components
import { Typography, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import red from '@material-ui/core/colors/red';
import Grid from '@material-ui/core/Grid/Grid';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { log } from 'utils/log';

import { IMasterLoadingComponentProps } from './IMasterLoadingComponentProps';
import { IMasterLoadingComponentState } from './IMasterLoadingComponentState';
import { masterLoadingStyles } from './masterLoadingStyles';

// - Import app components

// - Create MasterLoading component class
export class MasterLoadingComponent extends Component<
    IMasterLoadingComponentProps & WithTranslation,
    IMasterLoadingComponentState
> {
    // Constructor
    // eslint-disable-next-line
  constructor(props: IMasterLoadingComponentProps & WithTranslation) {
        super(props);
        // Binding functions to `this`
    }

    loadProgress() {
        const { error, timedOut, pastDelay, t, theme } = this.props;
        if (error) {
            log.error('error', error);
            return (
                <Grid container>
                    <Grid item>
                        <CircularProgress style={{ color: red[500] }} size={50} />
                    </Grid>
                    <Grid item style={{ zIndex: 1 }}>
                        <Typography variant="h6" color="primary" style={{ marginLeft: '15px' }}>
                            {t('masterLoading.unexpectedError')}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else if (timedOut) {
            return (
                <Grid container>
                    <Grid item>
                        <CircularProgress style={{ color: red[500] }} size={50} />
                    </Grid>
                    <Grid item style={{ zIndex: 1 }}>
                        <Typography variant="h6" color="primary" style={{ marginLeft: '15px' }}>
                            {t('masterLoading.timeout')}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else if (pastDelay) {
            return (
                <Grid container>
                    <Grid item>
                        <CircularProgress style={{ color: theme.palette.primary.light }} size={50} />
                    </Grid>
                    <Grid item style={{ zIndex: 1 }}>
                        <Typography variant="h6" color="primary" style={{ marginLeft: '15px' }}>
                            {/* {t('masterLoading.loading')} */}
                        </Typography>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container>
                    <Grid item>
                        <CircularProgress style={{ color: theme.palette.primary.light }} size={50} />
                    </Grid>
                    <Grid item style={{ zIndex: 1 }}>
                        <Typography variant="h6" color="primary" style={{ marginLeft: '15px' }}>
                            {/* {t('masterLoading.loading')} */}
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
    }

    // Render app DOM component
    render() {
        return <div className="mLoading__loading">{this.loadProgress()}</div>;
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(MasterLoadingComponent);

const stylesWrappedComponent = withStyles(masterLoadingStyles, { withTheme: true })(translateWrapper as any) as any;
export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(stylesWrappedComponent);
