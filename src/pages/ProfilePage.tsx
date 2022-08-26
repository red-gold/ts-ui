import ImgCover from 'components/imgCover';
import UserActivity from 'components/userActivity';
import React from 'react';
import config from 'config';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import * as postActions from 'redux/actions/postActions';
import * as userActions from 'redux/actions/userActions';
import * as globalActions from 'redux/actions/globalActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { postSelector } from 'redux/reducers/posts/postSelector';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import { userSelector } from 'redux/reducers/users/userSelector';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import RightPanel from 'components/profileRightPanel';
import CircularProgress from '@mui/material/CircularProgress';
import { experimentalStyled as styled } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import PostStreamComponent from '../containers/postStream';

const LoadingRoot = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
});

// Create selctors
const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectRequest = serverSelector.selectRequest();
const selectProfilePosts = postSelector.selectProfilePosts();
const selectHasMorePostProfile = postSelector.selectHasMorePostProfile();
const selectProfileBySocialName = userSelector.selectProfileBySocialName();
// ----------------------------------------------------------------------

export default function ProfilePage() {
    const { socialName } = useParams();
    const classes = useStyles();

    // Selectors

    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    // Select the user profile
    const profile: Map<string, any> = useSelector(
        (state: Map<string, any>) => selectProfileBySocialName(state, { socialName: socialName as string }) as any,
    );
    const currentUserId = currentUser.get('userId');
    const requestId = StringAPI.createServerRequestId(ServerRequestType.ProfileGetPosts, profile.get('id'));
    const postsRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId })) as Map<
        string,
        any
    >;
    const postsRequestStatus: ServerRequestStatusType = postsRequest.get('status', ServerRequestStatusType.NoAction);
    const hasMorePosts: boolean = useSelector((state: Map<string, any>) =>
        selectHasMorePostProfile(state, { userId: profile.get('id') }),
    );
    const posts = useSelector((state: Map<string, any>) => selectProfilePosts(state, { userId: profile.get('id') }));

    // Dispatcher
    const dispatch = useDispatch();
    const setHeaderTitle = (title: string) => dispatch<any>(globalActions.setHeaderTitle(title));

    const isCurrentUser = profile.get('id') === currentUserId;

    React.useEffect(() => {
        if (socialName) {
            setHeaderTitle(profile.get('fullName'));
            dispatch<any>(userActions.fetchProfileBySocialName(socialName));
        }
    }, [socialName, dispatch]);
    return profile.size > 0 ? (
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

                <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                    <div style={{ height: '24px' }} />
                    {!profile.isEmpty() ? (
                        <PostStreamComponent
                            posts={posts}
                            requestId={requestId}
                            loadStream={(page: number) =>
                                dispatch<any>(postActions.dbGetPostsByUserId(profile.get('id'), page)) as any
                            }
                            hasMorePosts={hasMorePosts}
                            requestStatus={postsRequestStatus}
                        />
                    ) : (
                        <></>
                    )}
                </Grid>
            </Grid>
        </>
    ) : (
        <LoadingRoot>
            <CircularProgress color="primary" />
        </LoadingRoot>
    );
}

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme: any) =>
    createStyles({
        banner: {
            backgroundAttachment: 'scroll',
            borderRadius: '12px',
            backgroundRepeat: 'unset !important',
            backgroundPosition: 'center center !important',
            [theme.breakpoints.down('xs')]: {
                backgroundAttachment: 'scroll',
                height: '220px !important',
            },
        },
        bannerContainer: {
            height: 384,
            [theme.breakpoints.down('xs')]: {
                height: '260px !important',
            },
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        gridItem: {
            padding: '24px !important',
        },
        postGrid: {
            'max-width': '700px !important',
        },
    }),
);
