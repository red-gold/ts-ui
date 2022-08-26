import React from 'react';
import { useTranslation } from 'react-i18next';
import PostStream from 'containers/postStream';
import Grid from '@mui/material/Grid';

import PostWriteButton from 'components/postWriteButton';
import RightPanel from 'components/rightPanel';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import * as postActions from 'redux/actions/postActions';
import * as globalActions from 'redux/actions/globalActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { postSelector } from 'redux/reducers/posts/postSelector';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Theme } from '@mui/material/styles/createTheme';
import { createStyles, makeStyles } from '@mui/styles';

// ----------------------------------------------------------------------
const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectHasMorePost = postSelector.selectHasMorePostStream();
const selectRequest = serverSelector.selectRequest();
const selectStreamPosts = postSelector.selectStreamPosts();
// ----------------------------------------------------------------------

export default function StreamPage() {
    const { t } = useTranslation();
    const classes = useStyles();
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    // Dispatcher
    const dispatch = useDispatch();
    const setHomeTitle = (homeTitle: string) => dispatch<any>(globalActions.setHeaderTitle(homeTitle || ''));
    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const currentUserId = currentUser.get('userId');
    const requestId = StringAPI.createServerRequestId(ServerRequestType.StreamGetPosts, currentUserId);
    const streamRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId })) as Map<
        string,
        any
    >;
    const streamRequestStatus: ServerRequestStatusType = streamRequest.get('status', ServerRequestStatusType.NoAction);
    const hasMorePosts: boolean = useSelector((state: Map<string, any>) => selectHasMorePost(state)) as boolean;
    const posts = useSelector((state: Map<string, any>) => selectStreamPosts(state));

    React.useEffect(() => {
        setHomeTitle(t('header.home'));
    }, []);

    return (
        <Grid container justifyContent="space-around" spacing={3}>
            <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                <PostWriteButton displayWriting />
                <PostStream
                    requestId={requestId}
                    posts={posts}
                    loadStream={(page: number) => dispatch<any>(postActions.fetchStreamPosts(page, 10)) as any}
                    hasMorePosts={hasMorePosts}
                    requestStatus={streamRequestStatus}
                />
            </Grid>
            {!mdDownHidden && (
                <Grid className={classes.gridItem} md={4} item>
                    <RightPanel />
                </Grid>
            )}
        </Grid>
    );
}

// ----------------------------------------------------------------------

export const useStyles = makeStyles(() =>
    createStyles({
        root: {},
        gridItem: {
            padding: '24px !important',
        },
        postGrid: {
            'max-width': '700px !important',
        },
    }),
);
