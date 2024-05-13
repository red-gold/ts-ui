import Grid from '@mui/material/Grid';
import { withStyles } from '@mui/styles';
import { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import config from 'config';

import { footerStyles } from './footerStyles';
import { IFooterComponentProps } from './IFooterComponentProps';
import { IFooterComponentState } from './IFooterComponentState';

export class FooterComponent extends Component<IFooterComponentProps & WithTranslation, IFooterComponentState> {
    constructor(props: IFooterComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    render() {
        const { classes, t } = this.props;

        return (
            <div className={classes.root}>
                {/* {CommonAPI.isMobile() ? <div style={{height: 90}}></div> : mobileElement} */}

                <div className={classes.content}>
                    <Grid item xs={12} sm={9} md={9} lg={9}>
                        <nav className={classes.nav}>
                            <ul className={classes.list}>
                                <li className={classes.item}>
                                    <NavLink to={`/terms`}>{t('terms.privacyTitle')}</NavLink>
                                </li>
                                <li className={classes.item}>
                                    <a href={`mailto:${config.settings.supportEmail}?Subject=Hello`} target="_top">
                                        {t('footer.supportEmail')}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </Grid>
                    <span className={classes.companyName}>
                        © {new Date().getFullYear()} {config.settings.companyName}
                    </span>
                </div>
            </div>
        );
    }
}

const translateWrapper = withTranslation('translations')(FooterComponent);

export default withStyles(footerStyles as any)(translateWrapper as any);
