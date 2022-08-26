// - Impoer react components
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { withStyles } from '@mui/styles';
import Zoom from '@mui/material/Zoom';
import AddVideoIcon from '@mui/icons-material/AddToQueue';
import SvgDelete from '@mui/icons-material/Delete';
import FileAPI from 'api/FileAPI';
import classNames from 'classnames';
import Img from 'components/img';
import { VideoFile } from 'core/domain/imageGallery';
import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import React, { Component, RefObject } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import config from 'config';
import * as globalActions from 'redux/actions/globalActions';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import { v4 as uuid } from 'uuid';

import { throwNoValue } from 'utils/errorHandling';
import { userGetters } from 'redux/reducers/users/userGetters';
import { IVideoGalleryProps } from './IVideoGalleryProps';
import { IVideoGalleryState } from './IVideoGalleryState';
import { videoGalleryStyles } from './videoGalleryStyles';

// - Material UI
// - Import actions
// - Import app components
// - Import API
/**
 * Create ImageGallery component class
 */
class VideoGalleryComponent extends Component<IVideoGalleryProps & WithTranslation, IVideoGalleryState> {
    styles = {
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        uploadButton: {
            verticalAlign: 'middle',
            fontWeight: 400,
        },
        uploadInput: {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: '100%',
            opacity: 0,
        },
        deleteVideo: {
            marginLeft: '5px',
            cursor: 'pointer',
            color: 'white',
        },
        addImage: {
            marginRight: '5px',
            cursor: 'pointer',
            color: 'white',
        },
    };

    /**
     * Fields
     */
    fileInputRef: RefObject<HTMLInputElement>;

    videoRef: RefObject<HTMLVideoElement>;

    file: any;

    /**
     * Component constructor
     */
    constructor(props: IVideoGalleryProps & WithTranslation) {
        super(props);

        this.state = {
            fileName: '',
            isPreview: false,
            isSaveDisabled: false,
        };

        this.fileInputRef = React.createRef();
        this.videoRef = React.createRef();
        // Binding function to `this`
        this.close = this.close.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleSetVideo = this.handleSetVideo.bind(this);
        this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
        this.videoList = this.videoList.bind(this);
        this.handleUploadVideo = this.handleUploadVideo.bind(this);
    }

    componentDidMount() {
        const { getVideoGallery } = this.props;
        if (getVideoGallery) {
            getVideoGallery();
        }
    }

    /**
     * Handle set video
     */
    handleSetVideo = (event: any, URL: string, fullPath: string) => {
        this.props.set(URL, fullPath);
        this.close();
    };

    togglePreview = () => {
        this.setState((prevState) => {
            if (prevState.isPreview && this.fileInputRef.current) {
                this.fileInputRef.current.value = '';
            }
            return { isPreview: !prevState.isPreview };
        });
    };

    /**
     * Handle delete video
     */
    handleDeleteVideo = (event: any, id: string) => {
        const { deleteVideo } = this.props;
        if (deleteVideo) {
            deleteVideo(id);
        }
    };

    /**
     * Handle on change file upload
     */
    onFileChange = (event: any) => {
        const { showError, t } = this.props;
        const extension = FileAPI.getExtension(event.target.files[0].name);
        let saveDisabled = false;
        const isExceedMax = FileAPI.checkMaxFileSize(event.target.files[0].size, config.settings.maxVideoFileSize);
        if (isExceedMax && showError) {
            saveDisabled = true;
            showError(t('videGallery.maxExceedMessage'));
        }
        const fileName = `${uuid()}.${extension}`;
        this.setState({
            isPreview: true,
            fileName,
            isSaveDisabled: saveDisabled,
        });
        this.file = event.currentTarget.files[0];
        const { type } = this.file;
        const videoNode = throwNoValue(this.videoRef.current, 'this.videoRef.current');
        let canPlay: any = videoNode.canPlayType(type);
        if (canPlay === '') {
            canPlay = 'no';
        }
        const fileURL = URL.createObjectURL(this.file);
        videoNode.src = fileURL;
    };

    /**
     * Hide image gallery
     */
    close = () => {
        const { close } = this.props;
        if (close) {
            close();
        }
    };

    videoList = () => {
        const { videos } = this.props;
        return throwNoValue(videos, 'videos').map((video: VideoFile) => {
            return (
                <ImageListItem key={throwNoValue(video.id, 'video.id')}>
                    <div>
                        <div style={{ overflowY: 'hidden', overflowX: 'auto' }}>
                            <ul
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '0 6px',
                                    margin: '8px 0 0 0',
                                    verticalAlign: 'bottom',
                                    flexShrink: 0,
                                    listStyleType: 'none',
                                }}
                            >
                                <div style={{ display: 'block' }}>
                                    <div style={{ display: 'block', marginRight: '8px', transition: 'transform .25s' }}>
                                        <li
                                            style={{
                                                width: '100%',
                                                margin: 0,
                                                verticalAlign: 'bottom',
                                                position: 'static',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <Img fileName={video.thumbnail} style={{ width: '100%', height: 'auto' }} />
                                        </li>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <ImageListItemBar
                        title={
                            <SvgDelete
                                style={this.styles.deleteVideo as any}
                                onClick={(evt) => this.handleDeleteVideo(evt, video.id || '0')}
                            />
                        }
                        position="top"
                        actionIcon={
                            <AddVideoIcon
                                style={this.styles.addImage as any}
                                onClick={(evt) => this.handleSetVideo(evt, video.URL, video.thumbnail || '')}
                            />
                        }
                        actionPosition="left"
                    />
                </ImageListItem>
            );
        });
    };

    /**
     * Handle upload video
     */
    handleUploadVideo = () => {
        const { uploadVideo } = this.props;
        const { fileName } = this.state;
        if (!this.videoRef.current || !uploadVideo) {
            return;
        }
        const videoCanvas = FileAPI.captureVideo(this.videoRef.current, null);

        videoCanvas.toBlob(
            (blobFile) => {
                if (blobFile) {
                    uploadVideo(this.file, fileName, blobFile);
                    this.togglePreview();
                }
            },
            'image/jpeg',
            0.95,
        );
    };

    render() {
        const { t, videos, classes } = this.props;
        const { isPreview, isSaveDisabled } = this.state;

        /**
         * Album element
         */
        const album = (
            <ImageList rowHeight={180} className={classNames(classes.ImageList, { [classes.noDisplay]: isPreview })}>
                <ImageListItem key="upload-image-gallery">
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: 'rgba(222, 222, 222, 0.52)',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <input
                            accept="video/mp4,video/x-m4v,video/*"
                            style={this.styles.uploadInput as any}
                            id="raised-button-file"
                            onChange={this.onFileChange}
                            ref={this.fileInputRef}
                            type="file"
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span" style={this.styles.uploadButton as any}>
                                {t('imageGallery.uploadButton')}
                            </Button>
                        </label>
                    </div>
                </ImageListItem>
                {videos && videos.count() > 0 ? this.videoList() : ''}
            </ImageList>
        );

        /**
         * Preveiew element
         */
        const preview = (
            <div className={classNames(classes.videoRoot, { [classes.noDisplay]: !isPreview })}>
                <video className={classNames(classes.video)} controls autoPlay={false} ref={this.videoRef}>
                    <track kind="captions" />
                </video>
            </div>
        );

        return (
            <div style={this.styles.root as any}>
                <Zoom in={!isPreview}>{album}</Zoom>
                <Zoom in={isPreview}>{preview}</Zoom>
                <div className={classNames(classes.previewActions, { [classes.noDisplay]: !isPreview })}>
                    <Button disabled={isSaveDisabled} color={'primary'} onClick={this.handleUploadVideo}>
                        {' '}
                        {t('videGallery.saveButton')}{' '}
                    </Button>
                    <Button onClick={this.togglePreview}> {t('videGallery.backButton')} </Button>
                </div>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        uploadVideo: (file: any, fileName: string, thumbnail: Blob) =>
            dispatch(imageGalleryActions.dbUploadVideo(file, fileName, thumbnail)),
        deleteVideo: (id: string) => dispatch(imageGalleryActions.dbDeletedVideo(id)),
        getVideoGallery: () => dispatch(imageGalleryActions.dbGetVideoGallery()),
        showError: (message: string) => dispatch(globalActions.showMessage(message)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>) => {
    const uid = state.getIn(['authorize', 'uid']) as string;
    const currentUser = userGetters.getUserProfileById(state, { userId: uid }).toJS() as User;
    return {
        videos: state.getIn(['imageGallery', 'videos'], Map({})),
        avatar: currentUser ? currentUser.avatar : '',
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(VideoGalleryComponent);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(videoGalleryStyles as any)(translateWrapper as any) as any);
