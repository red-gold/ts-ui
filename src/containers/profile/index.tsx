// - Import react components

import ImgCover from 'components/imgCover';
import UserActivity from 'components/userActivity';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import config from 'config';
import Grid from '@material-ui/core/Grid';

import PostStreamComponent from '../postStream';
import { IProfileProps } from './IProfileProps';
import { IProfileState } from './IProfileState';
import { withRouter } from 'react-router-dom';
import { throwNoValue } from 'utils/errorHandling';
import { connectProfile } from './connectProfile';

export class ProfileComponent extends Component<IProfileProps & WithTranslation, IProfileState> {
    historyUnlisten: any = null;
    static propTypes = {};

    constructor(props: IProfileProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            timeout: false,
        };
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.location !== prevProps.location) {
            this.forceUpdate();
            this.setState({ timeout: true });
            setTimeout(() => {
                this.setState({ timeout: false });
            }, 500);
        }
    }

    componentDidMount() {
        const { history, profile, loadUserInfo } = this.props;
        loadUserInfo();
        if (!this.historyUnlisten) {
            this.historyUnlisten = history.listen((location: any) => {
                const displayName = profile.get('fullName', '');
                this.props.setHeaderTitle(displayName);
            });
        }
        this.props.setHeaderTitle(profile.get('fullName', ''));
    }

    componentWillUnmount() {
        if (this.historyUnlisten) {
            this.historyUnlisten();
        }
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const {
            loadPosts,
            hasMorePosts,
            t,
            classes,
            profile,
            isCurrentUser,
            posts,
            requestId,
            postsRequestStatus,
        } = this.props;
        const trans = throwNoValue(t, 't');
        return (
            <>
                <div className={classes.bannerContainer}>
                    <ImgCover
                        height={'384px'}
                        width={'100%'}
                        className={classes.banner}
                        src={
                            profile && profile.get('banner')
                                ? profile.get('banner')
                                : config.settings.defaultProfileCover
                        }
                    />
                </div>
                <UserActivity profile={throwNoValue(profile, 'profile')} isCurrentUser={isCurrentUser} />
                <div style={{ height: '24px' }}></div>
                {/* <ProfileAlbumComponent userId={userId} isOwner={isCurrentUser}/> */}
                <div>
                    {!posts.isEmpty() ? (
                        <div className="profile__title">
                            {trans('profile.headPostsLabel', { userName: this.props.profile.get('fullName') })}
                        </div>
                    ) : (
                        ''
                    )}
                    <div style={{ height: '24px' }}></div>
                    <Grid container justify="center" spacing={3}>
                        <Grid className={classes.gridItem} classes={{ root: classes.postGrid }} xs={12} md={8} item>
                            {!this.state.timeout && (
                                <PostStreamComponent
                                    posts={posts}
                                    requestId={requestId}
                                    loadStream={loadPosts}
                                    hasMorePosts={hasMorePosts}
                                    requestStatus={postsRequestStatus}
                                />
                            )}
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
}

export default withRouter(connectProfile(ProfileComponent));
