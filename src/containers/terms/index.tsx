import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { withStyles } from '@mui/styles';
import { ITermsProps } from './ITermsProps';
import { ITermsState } from './ITermsState';
import { termsStyles } from './termsStyles';
import { TermsType } from './termsType';

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
                                <div />
                            )}
                            {selectedItem === TermsType.Privacy ? (
                                <Typography component="div"> </Typography>
                            ) : (
                                <div />
                            )}
                            {selectedItem === TermsType.Cookie ? (
                                <Typography component="div"> </Typography>
                            ) : (
                                <div />
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
