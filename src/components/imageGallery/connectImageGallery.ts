import { Map } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import { gallerySelector } from 'redux/reducers/imageGallery/gallerySelector';
import { withStyles } from '@mui/styles';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import { imageGalleryStyles } from './imageGalleryStyles';
import { IImageGalleryProps, IDispatchProps, IOwnProps, IStateProps } from './IImageGalleryProps';

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
        const progress = getProgress(state) as  Map<string, any>;
        const currentUser = selectCurrentUser(state) as  Map<string, any>;
        const requests = selectRequests(state) as  Map<string, any>;
        const gallery = selectGallery(state) as Map<string, Map<string, any>>;
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
    )(withStyles(imageGalleryStyles)(translateWrapper) as React.ComponentType<IImageGalleryProps>);
};
