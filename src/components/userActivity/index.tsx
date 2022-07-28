import Paper from '@mui/material/Paper';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import StringAPI from 'api/StringAPI';
import classNames from 'classnames';
import AboutDialogComponent from 'components/aboutDialog/AboutDialogComponent';
import EditProfile from 'components/editProfile/EditProfileComponent';
import FollowDialogComponent from 'components/user/FollowButton';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Map } from 'immutable';
import TimelineComponent from 'oldComponents/timeline';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PictureDialogComponent from 'oldComponents/pictureDialog';
import * as globalActions from 'redux/actions/globalActions';
import * as userActions from 'redux/actions/userActions';

import { IUserActivityComponentProps } from './IUserActivityProps';
import { IUserActivityComponentState } from './IUserActivityState';
import { userActivityStyles } from './userActivityStyles';

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
            privilegeOpen: false,
            picutreDialogOpen: false,
            pictureDialogURL: '',
            aboutOpen: false,
        };

        // Binding functions to `this`
        this.closePictureDialog = this.closePictureDialog.bind(this);
        this.openPictureDialog = this.openPictureDialog.bind(this);
        this.handleCloseAbout = this.handleCloseAbout.bind(this);
        this.handleOpenAbout = this.handleOpenAbout.bind(this);
    }

    /**
     * Handle close privilege
     */
    handleClosePrivileges = () => {
        this.setState({ privilegeOpen: false });
    };

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
     * Reneder component DOM
     */
    render() {
        const { t, classes, profile, isCurrentUser, editProfileOpen } = this.props;
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
                            displayName={profile.get('fullName')}
                            src={profile.get('avatar')}
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
const mapDispatchToProps = (dispatch: any) => ({
    setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
    openEditor: () => dispatch(userActions.openEditProfile()),
});

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => ({
    editProfileOpen: state.getIn(['user', 'openEditProfile']),
});

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(UserActivityComponent);
export default connect<{}, {}, IUserActivityComponentProps, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(userActivityStyles as any)(translateWrapper as any) as any) as any;
