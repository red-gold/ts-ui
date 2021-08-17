import { Map } from 'immutable';
import { connect } from 'react-redux';

import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as globalActions from 'redux/actions/globalActions';
import { IDispatchProps, IOwnProps, IAlbumDialogProps, IStateProps } from './IAlbumDialogProps';
import { Post } from 'core/domain/posts/post';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { albumDialogStyles } from './albumDialogStyles';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { Media } from 'core/domain/imageGallery/media';
import config from 'config';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        post: (albumPost: Post, images: Media[]) => dispatch(imageGalleryActions.dbCreateAlbum(albumPost, images)),
        uploadImage: (image: any, imageName: string) => dispatch(imageGalleryActions.dbUploadImage(image, imageName)),
        deleteImage: (fileId: string, fileName: string) =>
            dispatch(imageGalleryActions.dbDeleteImage(fileId, config.data.imageFolderPath, fileName)),
        progressChange: (percent: number, status: boolean) => dispatch(globalActions.progressChange(percent, status)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectRequest = serverSelector.selectRequest();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const requestId = StringAPI.createServerRequestId(
            ServerRequestType.GalleryCreateAlbum,
            currentUser.get('userId'),
        );
        const createAlbumRequest = selectRequest(state, { requestId });
        const createAlbumRequestStatus: ServerRequestStatusType = createAlbumRequest.get(
            'status',
            ServerRequestStatusType.NoAction,
        );
        return {
            currentUser,
            createAlbumRequestStatus,
        };
    };
    return mapStateToProps;
};

export const connectAlbumDialog = (component: React.ComponentType<IAlbumDialogProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(albumDialogStyles)(translateWrapper));
};
