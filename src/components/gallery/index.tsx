// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { useEffect } from 'react';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import { useStyles } from './galleryStyles';
import { IGalleryProps } from './IGalleryProps';
import { connectGallery } from './connectGallery';
import config from 'config';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteSweep';
import SelectIcon from '@material-ui/icons/CheckCircle';
import FileAPI from 'api/FileAPI';
import uuid from 'uuid';
import { WithTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

/**
 * The example data is structured as follows:
 *
 */
export function GalleryComponent(props: IGalleryProps & WithTranslation) {
    const { loadImageGallery, gallery, t, uploadRequestStatus } = props;
    const classes = useStyles();

    /**
     * Handle set image
     */
    const handleSetImage = (event: any, URL: string) => {
        const { set } = props;
        if (set) {
            set(URL);
            close();
        }
    };

    /**
     * Handle delete image
     */
    const handleDeleteImage = (event: any, id: string, fileName: string) => {
        const { deleteImage } = props;
        deleteImage(id, fileName);
    };

    /**
     * Handle send image resize event that pass the resized image
     */
    const handleSendResizedImage = (event: any) => {
        const { resizedImage, fileName } = event.detail;
        const { uploadOneImage, folder } = props;
        uploadOneImage(resizedImage, fileName, folder);
    };

    /**
     * Handle on change file upload
     */
    const onFileChange = (event: any) => {
        const file = event.target.files[0];
        const extension = FileAPI.getExtension(event.target.files[0].name);
        const fileId = uuid();
        const fileName = `${fileId}.${extension}`;

        // Resize image then call upload image by envent
        FileAPI.constraintImage(event.target.files[0], fileName);

        const parsedFiles: { file: any; fileName: string }[] = [];
        parsedFiles.push({ file: URL.createObjectURL(file), fileName });
    };

    /**
     * Hide image gallery
     */
    const close = () => {
        const { close } = props;
        if (close) {
            close();
        }
    };

    const getListElm = () => {
        const elmList: any[] = [];
        gallery.forEach((tiles, dir) => {
            elmList.push(
                <div key={`subheader-${dir}`} className={classes.tileHeader}>
                    <Typography variant="h6" color="textSecondary">
                        {dir}
                    </Typography>
                </div>,
            );
            const elmTiles: any[] = [];
            tiles.forEach((tile) =>
                elmTiles.push(
                    <GridListTile classes={{ tile: classes.tile }} key={tile.get('objectId')}>
                        <img src={tile.get('url')} alt={tile.get('fileName')} />
                        <GridListTileBar
                            titlePosition="top"
                            className={classes.titleBar}
                            actionIcon={
                                <>
                                    <IconButton
                                        onClick={(evt) =>
                                            handleDeleteImage(evt, tile.get('objectId'), tile.get('fileName'))
                                        }
                                        aria-label={`info about ${dir}`}
                                        className={classes.icon}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(evt) => handleSetImage(evt, tile.get('url'))}
                                        aria-label={`info about ${dir}`}
                                        className={classes.icon}
                                    >
                                        <SelectIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </GridListTile>,
                ),
            );
            elmList.push(
                <GridList cellHeight={180} cols={3} className={classes.gridList}>
                    {elmTiles}
                </GridList>,
            );
        });
        return elmList;
    };

    const inprogress = uploadRequestStatus === ServerRequestStatusType.Sent;

    useEffect(() => {
        window.addEventListener('onSendResizedImage', handleSendResizedImage);

        [config.data.avatarFolderPath, config.data.coverFolderPath].forEach((dir) => {
            loadImageGallery(dir);
        });

        return () => {
            window.removeEventListener('onSendResizedImage', handleSendResizedImage);
        };
    }, []);

    return (
        <div className={classNames(classes.root, { inprogress: inprogress })}>
            {inprogress && (
                <div className={classes.inprogress}>
                    <CircularProgress color="secondary" />
                </div>
            )}
            <div className={classes.header}>
                <input
                    accept="image/*"
                    className={classes.uploadInput}
                    id="raised-button-file"
                    onChange={onFileChange}
                    type="file"
                />
                <label htmlFor="raised-button-file">
                    <Button variant="outlined" component="span" color={'secondary'}>
                        {t('imageGallery.uploadButton')}
                    </Button>
                </label>
            </div>
            <div className={classes.body}>{getListElm()}</div>
        </div>
    );
}

export default connectGallery(GalleryComponent);
