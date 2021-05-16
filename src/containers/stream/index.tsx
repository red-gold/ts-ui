import React from 'react';
import { useTranslation } from 'react-i18next';
import PostStreamComponent from 'containers/postStream';
import Grid from '@material-ui/core/Grid';

import PostWriteButton from 'components/postWriteButton';
import RightPanel from 'components/rightPanel';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import * as postActions from 'store/actions/postActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import { useStyles } from './streamStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { Theme } from '@material-ui/core/styles/createTheme';

const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectHasMorePost = postSelector.selectHasMorePostStream();
const selectStreamPage = postSelector.selectStreamPage();
const selectRequest = serverSelector.selectRequest();
const selectStreamPosts = postSelector.selectStreamPosts();

export function StreamComponent() {
    const { t } = useTranslation();
    const classes = useStyles();
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    // Dispatcher
    const dispatch = useDispatch();
    const loadStream = (page: number, limit: number) => dispatch(postActions.dbGetPosts(page, limit));
    const setHomeTitle = (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || ''));
    const increasePage = () => dispatch(postActions.increasePageStream());

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const currentUserId = currentUser.get('userId');
    const requestId = StringAPI.createServerRequestId(ServerRequestType.StreamGetPosts, currentUserId);
    const streamRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId }));
    const streamRequestStatus: ServerRequestStatusType = streamRequest.get('status', ServerRequestStatusType.NoAction);
    const hasMorePosts: boolean = useSelector((state: Map<string, any>) => selectHasMorePost(state));
    const posts = useSelector((state: Map<string, any>) => selectStreamPosts(state));
    const page: number = useSelector((state: Map<string, any>) => selectStreamPage(state));

    React.useEffect(() => {
        setHomeTitle(t('header.home'));
    }, []);

    /**
     * Load posts
     */
    const loadPosts = () => {
        if (page !== undefined) {
            loadStream(page, 10);
            increasePage();
        }
    };

    return (
        <Grid container justifyContent="space-around" spacing={3}>
            <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                <PostWriteButton displayWriting />
                <PostStreamComponent
                    requestId={requestId}
                    posts={posts}
                    loadStream={loadPosts}
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

export default StreamComponent;
