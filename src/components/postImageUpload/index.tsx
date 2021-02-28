// - Impoer react components
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import SvgDelete from '@material-ui/icons/Delete';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Media } from 'core/domain/imageGallery/media';
import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import * as R from 'ramda';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import config from 'config';
import * as globalActions from 'store/actions/globalActions';
import * as imageGalleryActions from 'store/actions/imageGalleryActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';

import { IPostImageUploadProps } from './IPostImageUploadProps';
import { IPostImageUploadState } from './IPostImageUploadState';
import { postImageUploadStyles } from './postImageUploadStyles';
import { throwNoValue } from 'utils/errorHandling';

/**
 * Create component class
 */
export class PostImageUploadComponent extends Component<
    IPostImageUploadProps & WithTranslation,
    IPostImageUploadState
> {
    /**
     * Get drived state from props
     */
    static getDerivedStateFromProps(props: IPostImageUploadProps & WithTranslation, state: IPostImageUploadState) {
        if (!R.equals(props.photos, state.prevPhotos)) {
            return {
                selectedPhotos: [...props.photos],
                prevPhotos: props.photos,
            };
        }

        return null;
    }

    /**
     * Component constructor
     *
     */
    constructor(props: IPostImageUploadProps & WithTranslation) {
        super(props);

        this.state = {
            selectedPhotos: [],
            prevPhotos: [],
        };

        // Binding function to `this`
        this.imageList = this.imageList.bind(this);
        this.deleteSelectedPhoto = this.deleteSelectedPhoto.bind(this);
        this.saveAlbum = this.saveAlbum.bind(this);
    }

    /**
     * Save album
     */
    saveAlbum = () => {
        const { progress, currentUser } = this.props;
        const { accessUserList, permission } = this.state;

        // const albumTitle = StringAPI.isEmpty(this.state.albumName) ? t('album.defaultAlbumName') : this.state.albumName;

        const selectedPhotos = [...this.state.selectedPhotos];
        const images: Media[] = [];
        selectedPhotos.slice(0, 4).map((photo) => {
            const meta = progress.getIn([photo.fileName, 'meta'], { url: '' });
            const fileId = photo.fileName.split('.')[0];
            const image = new Media(
                fileId,
                0,
                0,
                meta.url || URL.createObjectURL(photo.src),
                meta.url || URL.createObjectURL(photo.src),
                photo.fileName,
                '',
                '',
                photo.fileName,
                throwNoValue(currentUser, 'currentUser').userId,
                0,
                '',
                0,
                0,
                '',
                false,
                accessUserList,
                permission,
            );
            images.push(image);
            return {
                url: meta.url,
                fileName: photo.fileName,
                fileId,
            };
        });
    };

    /**
     * Delete selected photo
     */
    deleteSelectedPhoto = (fileName: string) => {
        const { onDelete } = this.props;
        let selectedPhotos = [...this.state.selectedPhotos];
        selectedPhotos = selectedPhotos.filter((photo) => photo.fileName !== fileName);
        this.setState({
            selectedPhotos,
        });

        onDelete(fileName);
    };

    /**
     * Image list
     */
    imageList = () => {
        const { classes, progress } = this.props;
        const { selectedPhotos } = this.state;
        return selectedPhotos.map((photo) => {
            const progressPercent = progress.getIn([photo.fileName, 'percent'], 0);
            const progressVisible = progress.getIn([photo.fileName, 'visible'], false);

            return (
                <GridListTile key={`album-dialog-tile-${photo.fileName}`}>
                    <img src={photo.src} alt={'something'} />
                    <GridListTileBar
                        title={
                            progressVisible ? (
                                <LinearProgress variant="determinate" value={progressPercent} color="secondary" />
                            ) : (
                                ''
                            )
                        }
                        actionIcon={
                            !progressVisible ? (
                                <IconButton
                                    className={classes.icon}
                                    onClick={() => this.deleteSelectedPhoto(photo.fileName)}
                                >
                                    <SvgDelete />
                                </IconButton>
                            ) : (
                                ''
                            )
                        }
                    />
                </GridListTile>
            );
        });
    };

    /**
     * Render Grid tile
     */
    gridTile = () => {
        const { classes } = this.props;
        return (
            <GridList cellHeight={100} className={classes.gridList} cols={3}>
                {this.imageList()}
            </GridList>
        );
    };

    render() {
        const { classes } = this.props;

        return <div className={classes.root}>{this.gridTile()}</div>;
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
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
        const currentUser = selectCurrentUser(state).toJS() as User;
        const requestId = StringAPI.createServerRequestId(
            ServerRequestType.GalleryCreateAlbum,
            currentUser.userId || '0',
        );
        const createAlbumRequestStatus = selectRequest(state, { requestId });
        return {
            currentUser,
            createAlbumRequestStatus: createAlbumRequestStatus
                ? createAlbumRequestStatus.status
                : ServerRequestStatusType.NoAction,
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(PostImageUploadComponent);

const componentWithStyles: any = withStyles(postImageUploadStyles as any, { withTheme: true })(translateWrapper as any);
export default connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(componentWithStyles);
