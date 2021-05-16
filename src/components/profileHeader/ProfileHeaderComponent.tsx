import Button from '@material-ui/core/Button';
import EditProfile from 'components/editProfile/EditProfileComponent';
import ImgCover from 'components/imgCover';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Map } from 'immutable';
import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Background, Parallax } from 'react-parallax';
import { connect } from 'react-redux';
import config from 'config';
import * as userActions from 'store/actions/userActions';

import { IProfileHeaderComponentProps } from './IProfileHeaderComponentProps';
import { IProfileHeaderComponentState } from './IProfileHeaderComponentState';

export class ProfileHeaderComponent extends Component<
    IProfileHeaderComponentProps & WithTranslation,
    IProfileHeaderComponentState
> {
    constructor(props: IProfileHeaderComponentProps & WithTranslation) {
        super(props);

        /**
         * Defaul state
         */
        this.state = {
            /**
             * If it's true , the window is in small size
             */
            isSmall: false,
        };

        // Binding functions to `this`
    }
    /**
     * Handle resize event for window to change sidebar status
     * @param  {event} evt is the event is passed by winodw resize event
     */
    handleResize = () => {
        // Set initial state
        const width = window.innerWidth;

        if (width > 900) {
            this.setState({
                isSmall: false,
            });
        } else {
            this.setState({
                isSmall: true,
            });
        }
    };

    componentDidMount() {
        this.handleResize();
    }

    render() {
        const { t, isAuthedUser, editProfileOpen } = this.props;
        const styles = {
            avatar: {
                border: '2px solid rgb(255, 255, 255)',
            },
            iconButton: {
                fill: 'rgb(255, 255, 255)',
                height: '24px',
                width: '24px',
            },
            iconButtonSmall: {
                fill: 'rgb(0, 0, 0)',
                height: '24px',
                width: '24px',
            },

            editButton: {
                marginLeft: '20px',
            },
            editButtonSmall: {
                marginLeft: '20px',
                color: 'white',
                fill: 'blue',
            },
            aboutButton: {
                color: 'white',
            },
            aboutButtonSmall: {
                color: 'black',
            },
        };

        return (
            <div>
                <Parallax strength={500} className="profile__parallax" bgStyle={{ position: 'relative' }}>
                    <Background>
                        <ImgCover
                            width="100%"
                            height="510px"
                            borderRadius="12px"
                            src={this.props.banner || config.settings.defaultProfileCover}
                        />
                    </Background>
                </Parallax>
                <div className={this.state.isSmall ? 'profile__head-info-s' : 'profile__head-info'}>
                    <EventListener target="window" onResize={this.handleResize} />
                    <div className="left">
                        {/* User avatar*/}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <UserAvatar
                                fullName={this.props.fullName || ' '}
                                fileName={this.props.avatar}
                                size={60}
                                style={styles.avatar}
                            />
                        </div>
                        <div className="info">
                            <div className="fullName">{this.props.fullName}</div>
                            <div className="tagLine">{this.props.tagLine}</div>
                            {/*<div className='followers'>
                                {this.props.followerCount} Followers
                </div>*/}
                        </div>
                    </div>
                    <div className="right">
                        {isAuthedUser ? (
                            <div style={this.state.isSmall ? styles.editButtonSmall : styles.editButton}>
                                <Button variant="contained" onClick={this.props.openEditor}>
                                    {t('profile.editProfileButton')}
                                </Button>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                {isAuthedUser && editProfileOpen ? (
                    <EditProfile avatar={this.props.avatar} banner={this.props.banner} fullName={this.props.fullName} />
                ) : (
                    ''
                )}
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        openEditor: () => dispatch(userActions.openEditProfile()),
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
const translateWrapper = withTranslation('translations')(ProfileHeaderComponent);

export default connect<{}, {}, any, any>(mapStateToProps, mapDispatchToProps)(translateWrapper as any);
