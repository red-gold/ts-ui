import { connect } from 'react-redux';
import { postSelector } from 'redux/reducers/posts/postSelector';

import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { Map } from 'immutable';
import { IPhotoAlbumProps } from './IPhotoAlbumProps';

// - Import actions
import * as postActions from 'redux/actions/postActions';
import * as globalActions from 'redux/actions/globalActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { User } from 'core/domain/users/user';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { ComponentType } from 'react';
import { throwNoValue } from 'utils/errorHandling';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        search: (query: string, page: number, limit: number) =>
            dispatch(postActions.fetchSearchPosts(query, page, limit)),
        setHomeTitle: (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHasMorePost = postSelector.selectHasMorePostSeach();
    const selectRequest = serverSelector.selectRequest();
    const selectStreamPosts = postSelector.selectSearchPosts();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state).toJS() as User;
        const currentUserId = throwNoValue(currentUser.userId, 'currentUser.userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.SearchPosts, currentUserId);
        const searchRequestStatus = selectRequest(state, { requestId });
        const hasMorePosts = selectHasMorePost(state);
        const posts = selectStreamPosts(state);
        return {
            hasMorePosts,
            currentUser,
            searchRequestStatus: searchRequestStatus.get('status', ServerRequestStatusType.NoAction),
            posts,
            requestId,
        };
    };
    return mapStateToProps;
};

export const connectPhotoAlbum = (component: ComponentType<IPhotoAlbumProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
