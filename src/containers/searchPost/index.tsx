import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import PostStreamComponent from '../postStream';
import SearchComponent from '../search';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import * as postActions from 'store/actions/postActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { postSelector } from 'store/reducers/posts/postSelector';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { useStyles } from './searchPostStyles';

const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectHasMorePost = postSelector.selectHasMorePostSeach();
const selectRequest = serverSelector.selectRequest();
const selectStreamPosts = postSelector.selectSearchPosts();

export function SearchPostComponent() {
    const [currentPage, setCurrentPage] = React.useState(0);
    const location = useLocation();
    const classes = useStyles();
    const { t } = useTranslation();

    // Dispatchers
    const dispatch = useDispatch();
    const search = (query: string, page: number, limit: number) =>
        dispatch(postActions.dbSearchPosts(query, page, limit));

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const currentUserId = currentUser.get('userId');
    const requestId = StringAPI.createServerRequestId(ServerRequestType.SearchPosts, currentUserId);
    const streamRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId }));
    const searchRequestStatus = streamRequest.get('status', ServerRequestStatusType.NoAction);
    const hasMorePosts = useSelector((state: Map<string, any>) => selectHasMorePost(state));
    const posts = useSelector((state: Map<string, any>) => selectStreamPosts(state));

    const searchQuery = () => {
        executeSearch(location);
    };

    const executeSearch = (location: any, page?: number) => {
        const params: { q: string } = queryString.parse(location.search) as any;
        const pageNumber = page === undefined ? currentPage : page;
        search(params.q, pageNumber, 10);
        setCurrentPage(pageNumber + 1);
    };

    const searchParam = () => {
        const params: { q: string } = queryString.parse(location.search) as any;
        return params.q;
    };

    React.useEffect(() => {
        executeSearch(location, 0);
    }, [location]);

    return (
        <SearchComponent tab="posts">
            <div id="stream-parent" className={classNames({ [classes.noDisplay]: posts.isEmpty() })}>
                <Grid container justifyContent="center" spacing={3}>
                    <Grid classes={{ root: classes.postGrid }} xs={12} md={8} item>
                        <PostStreamComponent
                            posts={posts}
                            requestId={requestId}
                            loadStream={searchQuery}
                            hasMorePosts={hasMorePosts}
                            requestStatus={searchRequestStatus}
                        />
                    </Grid>
                </Grid>
            </div>
            <div className={classNames({ [classes.noDisplay]: !posts.isEmpty() })}>
                <Typography className={classes.notFound}>
                    {t('search.notFoundPost', { query: searchParam() })}
                </Typography>
            </div>
        </SearchComponent>
    );
}

export default SearchPostComponent;
