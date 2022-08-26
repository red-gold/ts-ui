import { Map } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import { gallerySelector } from 'redux/reducers/imageGallery/gallerySelector';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { IGalleryProps, IDispatchProps, IOwnProps, IStateProps } from './IGalleryProps';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IOwnProps) => {
    return {
        uploadOneImage: (image: any, imageName: string, dir: string) =>
            dispatch(imageGalleryActions.uploadOneImage(image, imageName, dir)),
        deleteImage: (fileId: string, fileName: string) =>
            dispatch(imageGalleryActions.dbDeleteImage(fileId, ownProps.folder, fileName)),
        tempAddImageToList: (mapImage: Map<string, any>) => dispatch(imageGalleryActions.addImageList(mapImage)),
        loadImageGallery: (dir: string) => dispatch(imageGalleryActions.dbGetImageGallery(dir)),
        tempAddImages: (uid: string, imageIds: Map<string, boolean>) =>
            dispatch(imageGalleryActions.addAvatarImages(uid, imageIds)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const getProgress = globalSelector.selectProgress();
    const selectRequest = serverSelector.selectRequest();
    const selectGallery = gallerySelector.selectGallery();

    const mapStateToProps = (state: Map<string, any>) => {
        const progress = getProgress(state);
        const currentUser = selectCurrentUser(state);

        const requestId = StringAPI.createServerRequestId(
            ServerRequestType.UploadFileInGallery,
            currentUser.get('userId'),
        );
        const request = selectRequest(state, { requestId }) as Map<string, ServerRequestStatusType>;
        const uploadRequestStatus = request.get('status', ServerRequestStatusType.NoAction);
        const gallery = selectGallery(state);

        return {
            progress,
            currentUser,
            uploadRequestStatus,
            gallery,
        };
    };
    return mapStateToProps;
};

export const connectGallery = (component: React.ComponentType<IGalleryProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(translateWrapper);
};
