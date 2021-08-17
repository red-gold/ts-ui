import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import FileAPI from 'api/FileAPI';
import AlbumDialogComponent from 'components/albumDialog/AlbumDialogComponent';
import { ActiveTabType } from 'components/ProfileAlbum/activeTabType';
import AlbumStreamComponent from 'containers/albumStream';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import uuid from 'uuid';

import { connectProfileAlbum } from './connectProfileAlbum';
import { IProfileAlbumProps } from './IProfileAlbumProps';
import { IProfileAlbumState } from './IProfileAlbumState';
import { profileAlbumStyles } from './profileAlbumStyles';

export class ProfileAlbumComponent extends Component<IProfileAlbumProps & WithTranslation, IProfileAlbumState> {
    /**
     * Fields
     */
    selectedPhotos: { src: string; file: any; fileName: string }[] = [];

    constructor(props: IProfileAlbumProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            activeTab: ActiveTabType.Album,
            acceptedFiles: [],
            rejectedFiles: [],
            albumDialogOpen: false,
        };

        // Binding functions to `this`
        this.onDrop = this.onDrop.bind(this);
        this.onUploadAlbumChange = this.onUploadAlbumChange.bind(this);
        this.closeAlbumDialog = this.closeAlbumDialog.bind(this);
        this.openAlbumDialog = this.openAlbumDialog.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    /**
     * Load albums
     */
    loadData() {
        const { loadAlbums, page, increasePage, userId } = this.props;
        if (loadAlbums && page !== undefined && increasePage) {
            loadAlbums(userId, page);
            increasePage();
        }
    }

    /**
     * Handle change tab
     */
    handleChangeTab = (event: any, activeTab: ActiveTabType) => {
        this.setState({ activeTab });
    };

    /**
     * Close album dialog
     */
    closeAlbumDialog = () => {
        const { closeAlbum } = this.props;
        if (closeAlbum) {
            closeAlbum();
        }
    };

    /**
     * Open album dialog
     */
    openAlbumDialog = () => {
        const { openAlbum } = this.props;
        if (openAlbum) {
            openAlbum();
        }
    };

    /**
     * Handle on change file upload
     */
    onUploadAlbumChange = (event: any) => {
        const { uploadImage } = this.props;
        if (uploadImage) {
            const files: File[] = event.currentTarget.files;
            const parsedFiles: { src: string; file: any; fileName: string }[] = [];
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                const file = files[fileIndex];
                const extension = FileAPI.getExtension(file.name);
                const fileName = `${uuid()}.${extension}`;
                parsedFiles.push({ src: URL.createObjectURL(file), fileName, file });
                uploadImage(file, fileName);
            }
            this.selectedPhotos = parsedFiles;
            this.openAlbumDialog();
            event.currentTarget.value = null;
        }
    };

    onDrop(acceptedFiles: any[], rejectedFiles: any[]) {
        this.setState({ acceptedFiles, rejectedFiles });
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { t, classes, albumDialogOpen, progress, posts, isOwner, hasMoreAlbum, userId } = this.props;
        const { activeTab } = this.state;
        const albumOpen = albumDialogOpen !== undefined ? albumDialogOpen : false;
        return (
            <>
                <div className={classes.card}>
                    <Paper className={classes.paperContainer}>
                        <div className={classes.root}>
                            <Tabs
                                value={activeTab}
                                onChange={this.handleChangeTab}
                                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                            >
                                {/* <Tab
                  value={ActiveTabType.Photos}
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={translate!('album.photos')}
                /> */}
                                <Tab
                                    disableRipple
                                    value={ActiveTabType.Album}
                                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                    label={t('album.album')}
                                />
                            </Tabs>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="album-button-file"
                                multiple
                                onChange={this.onUploadAlbumChange}
                                type="file"
                            />
                            {isOwner && (
                                <div className={classes.header}>
                                    <label htmlFor="album-button-file">
                                        <Button component="span" color="primary">
                                            <PhotoAlbumIcon />
                                            {t('album.createAlbum')}
                                        </Button>
                                    </label>
                                </div>
                            )}
                            <AlbumStreamComponent
                                posts={posts}
                                userId={userId}
                                loadStream={this.loadData}
                                hasMoreAlbum={hasMoreAlbum}
                            />
                        </div>
                        {albumOpen && progress ? (
                            <AlbumDialogComponent
                                open={albumOpen}
                                progress={progress}
                                photos={this.selectedPhotos}
                                onClose={this.closeAlbumDialog}
                            />
                        ) : (
                            ''
                        )}
                    </Paper>
                </div>
            </>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(ProfileAlbumComponent);
const routerWrapper = connectProfileAlbum(
    withStyles(profileAlbumStyles as any, { withTheme: true })(translateWrapper as any) as any,
);
export default routerWrapper;
