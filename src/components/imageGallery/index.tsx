// - Impoer react components
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import LinearProgress from '@mui/material/LinearProgress';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import SvgAddImage from '@mui/icons-material/AddAPhoto';
import SvgDelete from '@mui/icons-material/Delete';
import FileAPI from 'api/FileAPI';
import Img from 'components/img';
import { Map , fromJS } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import moment from 'moment/moment';
import {v4 as uuid} from 'uuid';

import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Media } from 'core/domain/imageGallery/media';
import config from 'config';

import { throwNoValue } from 'utils/errorHandling';
import { IImageGalleryProps } from './IImageGalleryProps';
import { IImageGalleryState } from './IImageGalleryState';
import { connectImageGallery } from './connectImageGallery';

let isPhotoSelected: boolean;

export class ImageGalleryComponent extends Component<IImageGalleryProps & WithTranslation, IImageGalleryState> {
    constructor(props: IImageGalleryProps & WithTranslation) {
        super(props);

        // Binding function to `this`
        this.close = this.close.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleSetImage = this.handleSetImage.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);
        this.imageList = this.imageList.bind(this);
        isPhotoSelected = false;
    }

    /**
     * Handle set image
     */
    handleSetImage = (event: any, URL: string) => {
        const { set } = this.props;
        if (set) {
            set(URL);
            this.close();
            isPhotoSelected = false;
        }
    };

    /**
     * Handle delete image
     */
    handleDeleteImage = (event: any, id: string, fileName: string) => {
        const { deleteImage } = this.props;
        deleteImage(id, fileName);
    };

    componentDidMount() {
        window.addEventListener('onSendResizedImage', this.handleSendResizedImage);
        const { loadData } = this.props;
        loadData();
    }

    componentWillUnmount() {
        window.removeEventListener('onSendResizedImage', this.handleSendResizedImage);
    }

    /**
     * Handle send image resize event that pass the resized image
     */
    handleSendResizedImage = (event: any) => {
        const { resizedImage, fileName } = event.detail;
        const { uploadImage } = this.props;

        uploadImage(resizedImage, fileName);
    };

    /**
     * Handle on change file upload
     */
    onFileChange = (event: any) => {
        const { tempAddImageToList, tempAddImages, currentUser } = this.props;
        const uid = currentUser.get('userId');
        const file = event.target.files[0];
        const extension = FileAPI.getExtension(event.target.files[0].name);
        const fileId = uuid();
        const fileName = `${fileId}.${extension}`;

        // Resize image then call upload image by envent
        FileAPI.constraintImage(event.target.files[0], fileName);

        isPhotoSelected = true;
        const parsedFiles: { file: any; fileName: string }[] = [];
        parsedFiles.push({ file: URL.createObjectURL(file), fileName });
        this.setState({
            selectedPhotos: parsedFiles,
        });

        const newAvatar = new Media(
            fileId,
            0,
            moment.utc().valueOf(),
            URL.createObjectURL(file),
            URL.createObjectURL(file),
            fileName,
            '',
            config.data.avatarFolderPath,
            fileName,
            throwNoValue(uid, 'uid'),
            0,
            '',
            0,
            0,
            '',
            false,
            [],
            UserPermissionType.Public,
        );

        const mapImage = Map({ [fileId]: fromJS({ ...newAvatar }) });

        tempAddImageToList(mapImage);
        tempAddImages(uid, Map({ [fileId]: true }));
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

    imageList = () => {
        const { progress, images, classes } = this.props;

        return images.map((image, index) => {
            let progressPercent: number = 100;
            let progressVisible: boolean = false;
            if (isPhotoSelected && index === 0) {
                progressPercent = progress ? progress.getIn([image.get('fileName'), 'percent'], 0) as number : 100;
                progressVisible = progress ? progress.getIn([image.get('fileName'), 'visible'], true) as boolean : false;
            }
            return (
                <ImageListItem key={image.get('objectId')}>
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
                                            <Img
                                                fileName={image.get('url')}
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </li>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <ImageListItemBar
                        title={
                            <SvgDelete
                                className={classes.deleteImage}
                                onClick={(evt) =>
                                    this.handleDeleteImage(evt, image.get('objectId'), image.get('fileName'))
                                }
                            />
                        }
                        position="top"
                        actionIcon={
                            <SvgAddImage
                                className={classes.addImage}
                                onClick={(evt) => this.handleSetImage(evt, image.get('url'))}
                            />
                        }
                        actionPosition="left"
                    />
                    <ImageListItemBar
                        title={
                            progressVisible ? (
                                <LinearProgress variant="determinate" value={progressPercent} color="secondary" />
                            ) : (
                                ''
                            )
                        }
                        position="bottom"
                    />
                </ImageListItem>
            );
        });
    };

    render() {
        const { t, images, classes } = this.props;
        /**
         * Component styles
         */

        return (
            <div className={classes.root}>
                <ImageList rowHeight={180} className={classes.ImageList}>
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
                                accept="image/*"
                                className={classes.uploadInput}
                                id="raised-button-file"
                                onChange={this.onFileChange}
                                type="file"
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span" className={classes.uploadButton}>
                                    {t('imageGallery.uploadButton')}
                                </Button>
                            </label>
                        </div>
                    </ImageListItem>
                    {images && images.count() > 0 ? this.imageList() : ''}
                </ImageList>
            </div>
        );
    }
}

export default connectImageGallery(ImageGalleryComponent);
