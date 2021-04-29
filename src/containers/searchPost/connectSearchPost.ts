import { connect } from 'react-redux';
import { postSelector } from 'store/reducers/posts/postSelector';

import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { Map } from 'immutable';
import { IDispatchProps, IOwnProps, ISearchPostProps, IStateProps } from './ISearchPostProps';

// - Import actions
import * as postActions from 'store/actions/postActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { ComponentType } from 'react';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        search: (query: string, page: number, limit: number) => dispatch(postActions.dbSearchPosts(query, page, limit)),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHasMorePost = postSelector.selectHasMorePostSeach();
    const selectRequest = serverSelector.selectRequest();
    const selectStreamPosts = postSelector.selectSearchPosts();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const currentUserId = currentUser.get('userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.SearchPosts, currentUserId);
        const streamRequest = selectRequest(state, { requestId });
        const searchRequestStatus = streamRequest.get('status', ServerRequestStatusType.NoAction);
        const hasMorePosts = selectHasMorePost(state);
        const posts = selectStreamPosts(state);
        return {
            hasMorePosts,
            currentUser,
            searchRequestStatus,
            posts,
            requestId,
        };
    };
    return mapStateToProps;
};

export const connectSearchPost = (component: ComponentType<ISearchPostProps>) =>
    connect<IStateProps, IDispatchProps, IOwnProps, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
