import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as postActions from 'store/actions/postActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';

import { IStreamComponentProps } from './IStreamComponentProps';
import { throwNoValue } from 'utils/errorHandling';

// - Import actions
/**
 * Map dispatch to props
 */
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
        const currentUser = selectCurrentUser(state).toJS() as User;
        const currentUserId = throwNoValue(currentUser.userId, 'currentUser.userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.StreamGetPosts, currentUserId);
        const streamRequestStatus = selectRequest(state, { requestId });
        const hasMorePosts = selectHasMorePost(state);
        const posts = selectStreamPosts(state);
        const page = selectStreamPage(state);
        return {
            hasMorePosts,
            currentUser,
            streamRequestStatus: streamRequestStatus.get('status', ServerRequestStatusType.NoAction),
            posts,
            requestId,
            page,
        };
    };
    return mapStateToProps;
};

export const connectStream = (component: ComponentType<IStreamComponentProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
