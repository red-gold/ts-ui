import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as postActions from 'store/actions/postActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';

import { IDispatchProps, IOwnProps, IStateProps, IStreamProps } from './IStreamProps';

const mapDispatchToProps = (dispatch: any) => {
    return {
        loadStream: (page: number, limit: number) => dispatch(postActions.dbGetPosts(page, limit)),
        setHomeTitle: (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || '')),
        increasePage: () => dispatch(postActions.increasePageStream()),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHasMorePost = postSelector.selectHasMorePostStream();
    const selectStreamPage = postSelector.selectStreamPage();
    const selectRequest = serverSelector.selectRequest();
    const selectStreamPosts = postSelector.selectStreamPosts();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const currentUserId = currentUser.get('userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.StreamGetPosts, currentUserId);
        const streamRequest = selectRequest(state, { requestId });
        const streamRequestStatus: ServerRequestStatusType = streamRequest.get(
            'status',
            ServerRequestStatusType.NoAction,
        );
        const hasMorePosts: boolean = selectHasMorePost(state);
        const posts = selectStreamPosts(state);
        const page: number = selectStreamPage(state);
        return {
            hasMorePosts,
            currentUser,
            streamRequestStatus,
            posts,
            requestId,
            page,
        };
    };
    return mapStateToProps;
};

export const connectStream = (component: ComponentType<IStreamProps>) =>
    connect<IStateProps, IDispatchProps, IOwnProps, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
