import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import StringAPI from 'api/StringAPI';
import classNames from 'classnames';
import AboutDialogComponent from 'components/aboutDialog/AboutDialogComponent';
import EditProfile from 'components/editProfile/EditProfileComponent';
import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Map } from 'immutable';
import TimelineComponent from 'layouts/timeline';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PictureDialogComponent from 'layouts/pictureDialog';
import * as globalActions from 'store/actions/globalActions';
import * as userActions from 'store/actions/userActions';

import { IUserActivityComponentProps } from './IUserActivityComponentProps';
import { IUserActivityComponentState } from './IUserActivityComponentState';
import { userActivityStyles } from './userActivityStyles';
import * as chatActions from 'store/actions/chatActions';
import { log } from 'utils/log';

export class UserActivityComponent extends Component<
    IUserActivityComponentProps & WithTranslation,
    IUserActivityComponentState
> {
    /**
     * Component constructor
     */
    constructor(props: IUserActivityComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            boxesStyle: [],
            privilegeOpen: false,
            storeOpen: false,
            storeRepOpen: false,
            picutreDialogOpen: false,
            pictureDialogURL: '',
            aboutOpen: false,
        };

        // Binding functions to `this`
        this.handleOpenStore = this.handleOpenStore.bind(this);
        this.handleCloseStore = this.handleCloseStore.bind(this);
        this.handleOpenStoreRep = this.handleOpenStoreRep.bind(this);
        this.handleCloseStoreRep = this.handleCloseStoreRep.bind(this);
        this.closePictureDialog = this.closePictureDialog.bind(this);
        this.openPictureDialog = this.openPictureDialog.bind(this);
        this.handleCloseAbout = this.handleCloseAbout.bind(this);
        this.handleOpenAbout = this.handleOpenAbout.bind(this);
    }

    /**
     * Handle open privilege
     */
    handleOpenPrivileges = () => {
        this.setState({ privilegeOpen: true });
    };

    /**
     * Handle close privilege
     */
    handleClosePrivileges = () => {
        this.setState({ privilegeOpen: false });
    };

    /**
     * Handle open store dialog
     */
    handleOpenStore() {
        this.setState({
            storeOpen: true,
        });
    }

    /**
     * Handle close store dialog
     */
    handleCloseStore() {
        this.setState({
            storeOpen: false,
        });
    }

    /**
     * Handle open about dialog
     */
    handleOpenAbout() {
        this.setState({
            aboutOpen: true,
        });
    }

    /**
     * Handle close about dialog
     */
    handleCloseAbout() {
        this.setState({
            aboutOpen: false,
        });
    }

    /**
     * Handle open store dialog
     */
    handleOpenStoreRep() {
        this.setState({
            storeRepOpen: true,
        });
    }

    /**
     * Handle close store dialog
     */
    handleCloseStoreRep() {
        this.setState({
            storeRepOpen: false,
        });
    }

    /**
     * Open picture dialog
     */
    openPictureDialog = (url: string) => {
        if (!StringAPI.isEmpty(url)) {
            this.setState({
                pictureDialogURL: url,
                picutreDialogOpen: true,
            });
        }
    };

    /**
     * Close picture dialog
     */
    closePictureDialog = () => {
        this.setState({
            pictureDialogURL: '',
            picutreDialogOpen: false,
        });
    };

    /**
     * Handle send message
     */
    handleSendMessage = () => {
        const { chatRequest, profile } = this.props;
        const userId = profile.get('userId');
        if (userId && chatRequest) {
            chatRequest(userId);
        } else {
            log.error('User id is null for chat request');
        }
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { t, classes, profile, isCurrentUser, editProfileOpen, openEditor } = this.props;
        const { privilegeOpen, pictureDialogURL, picutreDialogOpen, aboutOpen } = this.state;

        return (
            <>
                <Paper
                    sx={{ backgroundColor: '#ffffff80', marginLeft: 10 }}
                    className={classNames(classes.paper, classes.paperBackground)}
                >
                    <div onClick={() => this.openPictureDialog(profile.get('avatar'))}>
                        <UserAvatar
                            className={classes.userAvatar}
                            fullName={profile.get('fullName')}
                            fileName={profile.get('avatar')}
                            size={110}
                        />
                    </div>
                    <Typography variant="h5" className={classes.userNameText}>
                        {profile.get('fullName')}
                    </Typography>

                    <div className={classes.editButtonContainer}>
                        {!isCurrentUser && (
                            <div>
                                <FollowDialogComponent color="secondary" variant="contained" user={profile} />
                                <IconButton onClick={this.handleSendMessage}>
                                    <MailIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                    {isCurrentUser && editProfileOpen ? (
                        <EditProfile
                            avatar={profile.get('avatar')}
                            banner={profile.get('banner')}
                            fullName={profile.get('fullName')}
                        />
                    ) : (
                        ''
                    )}
                </Paper>

                <AboutDialogComponent targetUser={profile} open={aboutOpen} onClose={this.handleCloseAbout} />

                <TimelineComponent
                    title={t('userActivity.privileges')}
                    open={privilegeOpen}
                    onClose={this.handleClosePrivileges}
                />
                <PictureDialogComponent
                    open={picutreDialogOpen}
                    onClose={this.closePictureDialog}
                    images={[pictureDialogURL]}
                />
            </>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
        openEditor: () => dispatch(userActions.openEditProfile()),
        chatRequest: (userId: string) => dispatch(chatActions.activePeerChatRoom(userId)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => {
    return {
        editProfileOpen: state.getIn(['user', 'openEditProfile']),
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(UserActivityComponent);
export default connect<{}, {}, IUserActivityComponentProps, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(userActivityStyles as any)(translateWrapper as any) as any) as any;
