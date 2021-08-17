import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import { DialogType } from 'models/common/dialogType';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as globalActions from 'redux/actions/globalActions';
import * as userActions from 'redux/actions/userActions';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { userSelector } from 'redux/reducers/users/userSelector';

import { IProfileAlbumProps } from './IProfileAlbumProps';

// - Import actions
/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IProfileAlbumProps) => {
    return {
        loadAlbums: (userId: string, page: number) => dispatch(userActions.fetchAlbums(userId, page)),
        increasePage: () => dispatch(userActions.increasePageAlbum(ownProps.userId)),
        uploadImage: (image: any, imageName: string) => dispatch(imageGalleryActions.dbUploadImage(image, imageName)),
        setHomeTitle: (homeTitle: string) => dispatch(globalActions.setHeaderTitle(homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
        openAlbum: () => dispatch(globalActions.openDialog(DialogType.Album)),
        closeAlbum: () => dispatch(globalActions.closeDialog(DialogType.Album)),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectMoreAlbum = userSelector.selectMoreAlbum();
    const selectAlbumDialogState = globalSelector.selectDialogState();
    const selectProgress = globalSelector.selectProgress();
    const selectAlbumPosts = userSelector.selectAlbumPosts();
    const selectAlbumPage = userSelector.selectLastAlbumPage();

    const mapStateToProps = (state: Map<string, any>, ownProps: IProfileAlbumProps) => {
        const currentUser = selectCurrentUser(state).toJS() as User;
        const albumDialogOpen = selectAlbumDialogState(state, { type: DialogType.Album });
        const hasMoreAlbum = selectMoreAlbum(state, { userId: ownProps.userId });
        const posts = selectAlbumPosts(state, { userId: ownProps.userId });
        const progress = selectProgress(state);
        const page = selectAlbumPage(state, { userId: ownProps.userId });
        return {
            hasMoreAlbum,
            currentUser,
            posts,
            progress,
            albumDialogOpen,
            page,
        };
    };
    return mapStateToProps;
};

export const connectProfileAlbum = (component: ComponentType<IProfileAlbumProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
