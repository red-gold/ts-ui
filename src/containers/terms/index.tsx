import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { ITermsProps } from './ITermsProps';
import { ITermsState } from './ITermsState';
import { termsStyles } from './termsStyles';
import { TermsType } from './termsType';
import { withStyles } from '@material-ui/styles';

export class TermsComponent extends Component<ITermsProps & WithTranslation, ITermsState> {
    constructor(props: ITermsProps & WithTranslation) {
        super(props);
        this.state = {
            selectedItem: TermsType.Terms,
            selectedText: '',
            mobileOpen: false,
        };
    }

    handleChange = (value: number, text: string) => {
        this.setState({
            selectedItem: value,
            selectedText: text,
        });
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t } = this.props;

        const { selectedItem, selectedText } = this.state;

        return (
            <div className={classes.root}>
                <AppBar className={classes.appBar} color="secondary">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.navIconHide}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            {selectedItem === TermsType.Terms ? t('terms.termsTitle') : selectedText}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Paper>
                        <div className={classes.container}>
                            {selectedItem === TermsType.Terms ? (
                                <Typography component="div"> </Typography>
                            ) : (
                                <div></div>
                            )}
                            {selectedItem === TermsType.Privacy ? (
                                <Typography component="div"> </Typography>
                            ) : (
                                <div></div>
                            )}
                            {selectedItem === TermsType.Cookie ? (
                                <Typography component="div"> </Typography>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </Paper>
                </main>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {};
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(TermsComponent);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(termsStyles as any, { withTheme: true })(translateWrapper as any));
