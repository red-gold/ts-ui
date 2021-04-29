import { Map } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IImageGalleryProps, IDispatchProps, IOwnProps, IStateProps } from './IImageGalleryProps';
import { imageGalleryStyles } from './imageGalleryStyles';
import { globalSelector } from 'store/reducers/global/globalSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { gallerySelector } from 'store/reducers/imageGallery/gallerySelector';
import { withStyles } from '@material-ui/core/styles';
import * as imageGalleryActions from 'store/actions/imageGalleryActions';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IOwnProps) => {
    return {
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
    const selectRequests = serverSelector.selectRequests();
    const selectGallery = gallerySelector.selectGallery();
    const mapStateToProps = (state: Map<string, any>) => {
        const progress = getProgress(state);
        const currentUser = selectCurrentUser(state);
        const requests = selectRequests(state);
        const gallery = selectGallery(state);
        return {
            progress,
            currentUser,
            requests,
            gallery,
        };
    };
    return mapStateToProps;
};

export const connectImageGallery = (component: React.ComponentType<IImageGalleryProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(imageGalleryStyles)(translateWrapper));
};
