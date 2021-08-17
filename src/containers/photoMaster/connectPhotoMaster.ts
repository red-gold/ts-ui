import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Post } from 'core/domain/posts/post';
import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import { DialogType } from 'models/common/dialogType';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { throwNoValue } from 'utils/errorHandling';
import * as globalActions from 'redux/actions/globalActions';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as postActions from 'redux/actions/postActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { gallerySelector } from 'redux/reducers/imageGallery/gallerySelector';
import { postSelector } from 'redux/reducers/posts/postSelector';
import { serverSelector } from 'redux/reducers/server/serverSelector';

import { IPhotoMasterProps } from './IPhotoMasterProps';

// - Import actions
/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IPhotoMasterProps) => {
    const { userId, albumId } = ownProps.match.params;
    return {
        updateAlbum: (post: Map<string, any>) => dispatch(postActions.dbUpdatePost(post, [])),
        loadImages: () => dispatch(imageGalleryActions.dbFetchAlbumImages(userId, albumId)),
        loadAlbum: () => dispatch(postActions.dbGetPostById(userId, albumId)),
        uploadImage: (image: any, imageName: string) => dispatch(imageGalleryActions.dbUploadImage(image, imageName)),
        deleteAlbum: (albumId: string) => dispatch(postActions.dbDeletePost(albumId)),
        setHomeTitle: (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
        openAlbum: () => dispatch(globalActions.openDialog(DialogType.Album)),
        closeAlbum: () => dispatch(globalActions.closeDialog(DialogType.Album)),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHasMoreImage = gallerySelector.selectMoreImages();
    const selectRequest = serverSelector.selectRequest();
    const selectAlbumImages = gallerySelector.selectAlbumImages();
    const selectAlbum = postSelector.selectPost();
    const selectAlbumDialogState = globalSelector.selectDialogState();
    const selectProgress = globalSelector.selectProgress();

    const mapStateToProps = (state: Map<string, any>, ownProps: IPhotoMasterProps) => {
        const { albumId } = ownProps.match.params;
        const currentUser = selectCurrentUser(state).toJS() as User;
        const albumDialogOpen = selectAlbumDialogState(state, { type: DialogType.Album });
        const progress = selectProgress(state);
        const requestId = StringAPI.createServerRequestId(
            ServerRequestType.StreamGetPosts,
            throwNoValue(currentUser.userId, 'currentUser.userId'),
        );
        const streamRequestStatus = selectRequest(state, { requestId });
        const hasMoreImages = selectHasMoreImage(state, albumId);
        const images = selectAlbumImages(state, { albumId }).toJS();
        const currentAlbum: Post = selectAlbum(state, { postId: albumId }).toJS();
        const isOwner = currentAlbum.ownerUserId === currentUser.userId;
        return {
            hasMoreImages,
            currentUser,
            streamRequestStatus: streamRequestStatus.get('status', ServerRequestStatusType.NoAction),
            images,
            requestId,
            currentAlbum,
            progress,
            albumDialogOpen,
            isOwner,
        };
    };
    return mapStateToProps;
};

export const connectPhotoMaster = (component: ComponentType<IPhotoMasterProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
