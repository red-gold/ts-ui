import ImgCover from 'components/imgCover';
import UserActivity from 'components/userActivity';
import React, { useState } from 'react';
import config from 'config';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import PostStreamComponent from '../postStream';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import * as postActions from 'store/actions/postActions';
import * as userActions from 'store/actions/userActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { userSelector } from 'store/reducers/users/userSelector';
import { useParams } from 'react-router-dom';
import { useStyles } from './profileStyles';
import { IProfileProps } from './IProfileProps';

// Create selctors
const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectRequest = serverSelector.selectRequest();
const selectProfilePosts = postSelector.selectProfilePosts();
const selectHasMorePostProfile = postSelector.selectHasMorePostProfile();
const selectUserProfileById = userSelector.selectUserProfileById();

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import RightPanel from 'components/profileRightPanel';

export function ProfileComponent(props: IProfileProps) {
    const [timeout, setProfileTimeout] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();
    const { userId } = useParams();
    const classes = useStyles();
    // Dispatcher
    const dispatch = useDispatch();
    const loadPosts = (page: number) => dispatch(postActions.dbGetPostsByUserId(userId, page));
    const loadUserInfo = () => dispatch(userActions.dbGetUserInfoByUserId(userId));
    const setHeaderTitle = (title: string) => dispatch(globalActions.setHeaderTitle(title));

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const currentUserId = currentUser.get('userId');
    const requestId = StringAPI.createServerRequestId(ServerRequestType.ProfileGetPosts, userId);
    const postsRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId }));
    const postsRequestStatus: ServerRequestStatusType = postsRequest.get('status', ServerRequestStatusType.NoAction);
    const hasMorePosts: boolean = useSelector((state: Map<string, any>) => selectHasMorePostProfile(state, { userId }));
    const posts = useSelector((state: Map<string, any>) => selectProfilePosts(state, { userId }));
    const profile = useSelector((state: Map<string, any>) => selectUserProfileById(state, { userId }));

    const isCurrentUser = userId === currentUserId;

    React.useEffect(() => {
        const { profile } = props;
        loadUserInfo();
        if (profile) {
            setHeaderTitle(profile.get('fullName'));
        }
        setProfileTimeout(true);
        setTimeout(() => {
            setProfileTimeout(false);
        }, 100);
    }, [location]);

    return (
        <>
            <div className={classes.bannerContainer}>
                <ImgCover
                    height={'384px'}
                    width={'100%'}
                    className={classes.banner}
                    src={profile && profile.get('banner') ? profile.get('banner') : config.settings.defaultProfileCover}
                />
                <UserActivity profile={profile} isCurrentUser={isCurrentUser} />
            </div>
            <Grid container justifyContent="space-around" spacing={3}>
                <Grid className={classes.gridItem} md={4} item>
                    <RightPanel isCurrentUser={isCurrentUser} profile={profile} />
                </Grid>

                {/* <ProfileAlbumComponent userId={userId} isOwner={isCurrentUser}/> */}

                <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                    {!posts.isEmpty() && props.profile ? (
                        <div className="profile__title">
                            {t('profile.headPostsLabel', { userName: props.profile.get('fullName') })}
                        </div>
                    ) : (
                        ''
                    )}
                    <div style={{ height: '24px' }}></div>
                    {!timeout && (
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
        </>
    );
}

export default ProfileComponent;
