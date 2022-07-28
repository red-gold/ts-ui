// - Impoer react components
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { withStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import BackIcon from '@mui/icons-material/ArrowBack';
import StringAPI from 'api/StringAPI';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TransitionProps } from '@mui/material/transitions';

import { aboutDialogStyles } from './aboutDialogStyles';
import { IAboutDialogProps } from './IAboutDialogProps';
import { IAboutDialogState } from './IAboutDialogState';

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />;
});


export class AboutDialogComponent extends Component<IAboutDialogProps & WithTranslation, IAboutDialogState> {
    constructor(props: IAboutDialogProps & WithTranslation) {
        super(props);

        this.state = {};

        // Binding function to `this`

        this.closeDialog = this.closeDialog.bind(this);
        this.infoRender = this.infoRender.bind(this);
    }

    /**
     * Close dialog
     */
    closeDialog = () => {
        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }
    };

    /**
     * Infor render
     */
    infoRender = (title: string, content: string) => {
        const { classes } = this.props;
        return (
            <div className={classes.infoItem}>
                <div className={classes.subtitleInfo}>{title}</div>
                <div className={classes.contentInfo}>{content}</div>
            </div>
        );
    };

    render() {
        const { t, classes, open, onClose, targetUser } = this.props;

        const aboutElem = (
            <div className={classes.rootInfo}>
                <Typography variant="h6" color="inherit" className={classes.title}>
                    {t('profile.about')} {targetUser.get('fullName')}
                </Typography>
                <Paper className={classes.paperInfo}>
                    {!StringAPI.isEmpty(targetUser.get('tagLine')) &&
                        this.infoRender(t('profile.bio'), targetUser.get('tagLine'))}
                    {targetUser.get('birthday') &&
                        targetUser.get('birthday') > 0 &&
                        this.infoRender(
                            t('profile.birthday'),
                            moment.unix(targetUser.get('birthday')).local().format('LL'),
                        )}
                    {!StringAPI.isEmpty(targetUser.get('companyName')) &&
                        this.infoRender(t('profile.companyName'), targetUser.get('companyName') || '')}
                </Paper>
            </div>
        );

        const otherSocialElem = (
            <div className={classes.rootInfo}>
                <Typography variant="h6" color="inherit" className={classes.title}>
                    {t('profile.otherSocial')}
                </Typography>
                <Paper className={classes.paperInfo}>
                    {!StringAPI.isEmpty(targetUser.get('twitterId')) &&
                        this.infoRender(t('profile.twitterId'), targetUser.get('twitterId') || '')}
                    {!StringAPI.isEmpty(targetUser.get('facebookId')) &&
                        this.infoRender(t('profile.facebookId'), targetUser.get('facebookId') || '')}
                    {!StringAPI.isEmpty(targetUser.get('instagramId')) &&
                        this.infoRender(t('profile.instagramId'), targetUser.get('instagramId') || '')}
                </Paper>
            </div>
        );

        return (
            <Dialog open={open} classes={{ paper: classes.paper }} onClose={onClose} TransitionComponent={Transition}>
                <div className={classes.root}>
                    <AppBar position="sticky" color="primary">
                        <Toolbar>
                            <IconButton onClick={onClose}>
                                <BackIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                {targetUser.get('fullName')}
                            </Typography>
                            <UserAvatarComponent
                                displayName={targetUser.get('fullName')}
                                src={targetUser.get('avatar')}
                                size={32}
                                style={classes.avatar}
                            />
                        </Toolbar>
                    </AppBar>
                    <div className={classes.content}>
                        {(StringAPI.isEmpty(targetUser.get('tagLine')) ||
                            (targetUser.get('birthday') && targetUser.get('birthday') > 0) ||
                            !StringAPI.isEmpty(targetUser.get('companyName'))) &&
                            aboutElem}

                        {(!StringAPI.isEmpty(targetUser.get('twitterId')) ||
                            !StringAPI.isEmpty(targetUser.get('facebookId')) ||
                            !StringAPI.isEmpty(targetUser.get('instagramId'))) &&
                            otherSocialElem}
                    </div>
                </div>
            </Dialog>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(AboutDialogComponent);
const componentWithStyles: any = withStyles(aboutDialogStyles as any, { withTheme: true })(translateWrapper);
export default componentWithStyles;
