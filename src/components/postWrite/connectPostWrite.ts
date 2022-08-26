import { Map } from 'immutable';
import { connect } from 'react-redux';

import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as postActions from 'redux/actions/postActions';
import * as globalActions from 'redux/actions/globalActions';
import { DialogType } from 'models/common/dialogType';
import { Post } from 'core/domain/posts/post';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles } from '@mui/styles';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { postSelector } from 'redux/reducers/posts/postSelector';
import { postWriteStyles } from './postWriteStyles';
import { IDispatchProps, IOwnProps, IPostWriteProps, IStateProps } from './IPostWriteProps';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        openAlbum: () => dispatch(globalActions.openDialog(DialogType.PostAlbum)),
        closeAlbum: () => dispatch(globalActions.closeDialog(DialogType.PostAlbum)),
        post: (
            post: Post,
            filesToUpload: {
                src: string;
                file: any;
                fileName: string;
            }[],
        ) => dispatch(postActions.dbAddPost(post, filesToUpload)),
        update: (
            post: Map<string, any>,
            filesToUpload: {
                src: string;
                file: any;
                fileName: string;
            }[],
        ) => dispatch(postActions.dbUpdatePost(post, filesToUpload)),
        uploadImage: (image: any, imageName: string) => dispatch(imageGalleryActions.dbUploadImage(image, imageName)),
        onRequestClose: () => dispatch(globalActions.closeDialog(DialogType.PostWrite)),
        setPostWriteModel: (model: Map<string, any> | null) => dispatch(postActions.setPostWriteModel(model)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectDialogState = globalSelector.selectDialogState();
    const selectProgress = globalSelector.selectProgress();
    const selectRequest = serverSelector.selectRequest();
    const selectPostWriteModel = postSelector.selectPostWriteModel();
    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const albumDialogOpen = selectDialogState(state, { type: DialogType.PostAlbum }) as boolean;
        const postWriteOpen = selectDialogState(state, { type: DialogType.PostWrite }) as boolean;
        const progress = selectProgress(state);

        const postModel = selectPostWriteModel(state);

        const requestId = StringAPI.createServerRequestId(ServerRequestType.PostUpdate, currentUser.get('userId'));
        const request = selectRequest(state, { requestId }) as Map<string, ServerRequestStatusType>;
        const updatePostRequestStatus = request.get('status', ServerRequestStatusType.NoAction);

        return {
            postWriteOpen,
            currentUser,
            albumDialogOpen,
            progress,
            updatePostRequestStatus,
            postModel,
            edit: !!postModel,
        };
    };
    return mapStateToProps;
};

export const connectPostWrite = (component: React.ComponentType<IPostWriteProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(postWriteStyles)(translateWrapper) as React.ComponentType<IPostWriteProps>);
};
