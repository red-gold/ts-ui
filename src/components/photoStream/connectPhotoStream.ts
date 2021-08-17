import { connect } from 'react-redux';
import { postSelector } from 'redux/reducers/posts/postSelector';

import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { Map } from 'immutable';
import { IPhotoStreamProps } from './IPhotoStreamProps';
import config from 'config';

// - Import actions
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as globalActions from 'redux/actions/globalActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { User } from 'core/domain/users/user';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { gallerySelector } from 'redux/reducers/imageGallery/gallerySelector';
import { ComponentType } from 'react';
import { throwNoValue } from 'utils/errorHandling';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteImage: (fileId: string, fileName: string) =>
            dispatch(imageGalleryActions.dbDeleteImage(fileId, config.data.imageFolderPath, fileName)),
        setHomeTitle: (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHasMorePhotos = gallerySelector.selectMoreImages();
    const selectRequest = serverSelector.selectRequest();
    const selectStreamPosts = postSelector.selectSearchPosts();

    const mapStateToProps = (state: Map<string, any>, ownProps: IPhotoStreamProps) => {
        const currentUser = selectCurrentUser(state).toJS() as User;
        const currentUserId = throwNoValue(currentUser.userId, 'currentUser.userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.SearchPosts, currentUserId);
        const searchRequestStatus = selectRequest(state, { requestId });
        const currentAlbumId = throwNoValue(ownProps.currentAlbum.id, 'ownProps.currentAlbum.id');

        const hasMorePhotos = selectHasMorePhotos(state, { albumId: currentAlbumId });
        const posts = selectStreamPosts(state);
        return {
            hasMorePhotos,
            currentUser,
            searchRequestStatus: searchRequestStatus.get('status', ServerRequestStatusType.NoAction),
            posts,
            requestId,
        };
    };
    return mapStateToProps;
};

export const connectPhotoStream = (component: ComponentType<IPhotoStreamProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
