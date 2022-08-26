// - Impoer react components
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import ImageList from '@mui/material/ImageList';
import Fab from '@mui/material/Fab';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import SvgDelete from '@mui/icons-material/Delete';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LockIcon from '@mui/icons-material/VpnLock';
import FileAPI from 'api/FileAPI';
import StringAPI from 'api/StringAPI';
import UserPermissionComponent from 'components/userPermission/UserPermissionComponent';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Album } from 'core/domain/imageGallery/album';
import { Media } from 'core/domain/imageGallery/media';
import { Post } from 'core/domain/posts/post';
import { PostType } from 'core/domain/posts/postType';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import SwipeableViews from 'react-swipeable-views';
import config from 'config';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { v4 as uuid } from 'uuid';
import { TransitionProps } from '@mui/material/transitions';
import { Map } from 'immutable';
import { IAlbumDialogProps } from './IAlbumDialogProps';
import { IAlbumDialogState } from './IAlbumDialogState';
import { connectAlbumDialog } from './connectAlbumDialog';

const tutorialSteps = [
    {
        label: '',
    },
    {
        label: '',
    },
];

const Transition = React.forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement<any, any>;
        },
        ref: React.Ref<unknown>,
    ) => <Slide direction="up" ref={ref} {...props} />,
);

export class AlbumDialogComponent extends Component<IAlbumDialogProps & WithTranslation, IAlbumDialogState> {
    static getDerivedStateFromProps(props: IAlbumDialogProps & WithTranslation, state: IAlbumDialogState) {
        if (props.progress) {
            for (let index = 0; index < state.selectedPhotos.length; index++) {
                const photo = state.selectedPhotos[index];
                if (props.progress.getIn([photo.fileName, 'percent'], 0) !== 100) {
                    return {
                        nextDisabled: true,
                    };
                }
            }
            return {
                nextDisabled: false,
            };
        }
        return null;
    }

    constructor(props: IAlbumDialogProps & WithTranslation) {
        super(props);

        this.state = {
            activeStep: 0,
            selectedPhotos: [...props.photos],
            nextDisabled: true,
            description: props.currentAlbum && props.currentAlbum.body ? props.currentAlbum.body : '',
            descriptionError: '',
            albumName:
                props.currentAlbum && props.currentAlbum.album && props.currentAlbum.album.title
                    ? props.currentAlbum.album.title
                    : '',
            saveDisabled: props.currentAlbum === undefined,
            albumNameError: '',
            accessUserList:
                props.currentAlbum && props.currentAlbum.accessUserList ? props.currentAlbum.accessUserList : [],
            permission:
                props.currentAlbum && props.currentAlbum.permission
                    ? props.currentAlbum.permission
                    : UserPermissionType.Public,
            permissionOpen: false,
        };

        // Binding function to `this`
        this.close = this.close.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleSetImage = this.handleSetImage.bind(this);
        this.imageList = this.imageList.bind(this);
        this.deleteSelectedPhoto = this.deleteSelectedPhoto.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveAlbum = this.saveAlbum.bind(this);
        this.handleTogglePermission = this.handleTogglePermission.bind(this);
        this.getPermissionLabel = this.getPermissionLabel.bind(this);
        this.handleAccessList = this.handleAccessList.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.createAlbum = this.createAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
    }

    /**
     * Handle set image
     */
    handleSetImage = () => {
        this.close();
    };

    /**
     * Handle change input
     */
    handleChange = (name: string) => (event: any) => {
        const { t } = this.props;
        const targetValue = event.target.value;
        let error: any = null;
        if (StringAPI.isEmpty(targetValue)) {
            error = t(`album.${name}Error`);
        }
        this.setState(() => ({
            [name]: targetValue,
            [`${name}Error`]: error,
            saveDisabled: !StringAPI.isEmpty(error),
        }));
    };

    /**
     * Handle next step
     */
    handleNext = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    /**
     * Handle back step
     */
    handleBack = () => {
        this.setState((prevState) => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    /**
     * Toggle Permission dialog
     */
    handleTogglePermission = () => {
        this.setState((prevState) => ({
            permissionOpen: !prevState.permissionOpen,
        }));
    };

    /**
     * Handle post access list
     */
    handleAccessList = (accessList: string[], selectedAccess: UserPermissionType) => {
        this.setState({
            accessUserList: accessList,
            permission: selectedAccess,
            permissionOpen: false,
        });
    };

    /**
     * Close dialog
     */
    closeDialog = () => {
        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }
    };

    /**
     * Save album
     */
    saveAlbum = () => {
        const { progress, t, currentUser, currentAlbum } = this.props;
        const { accessUserList, permission } = this.state;

        const description = StringAPI.isEmpty(this.state.description) ? '' : this.state.description;
        const albumTitle = StringAPI.isEmpty(this.state.albumName) ? t('album.defaultAlbumName') : this.state.albumName;

        const selectedPhotos = [...this.state.selectedPhotos];
        const images: Media[] = [];
        const mappedPhotos = selectedPhotos.map((photo) => {
            const meta = progress.getIn([photo.fileName, 'meta'], { url: '' }) as { url: string };
            const fileId = photo.fileName.split('.')[0];
            const image = new Media(
                fileId,
                0,
                0,
                URL.createObjectURL(photo.src as unknown as Blob),
                URL.createObjectURL(photo.src as unknown as Blob),
                photo.fileName,
                '',
                '',
                photo.fileName,
                currentUser.get('userId'),
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

        const album = {
            photos: mappedPhotos.slice(0, 4),
            cover: mappedPhotos[0].url,
            coverId: mappedPhotos[0].fileId,
            count: mappedPhotos.length,
            title: albumTitle,
        };
        const photos: string[] = album.photos.map((image) => image.url);
        const parsedAlbum = new Album(photos, album.cover, album.coverId, album.count, album.title);
        if (!currentAlbum) {
            this.createAlbum(
                currentUser,
                description,
                mappedPhotos[0].url,
                parsedAlbum,
                accessUserList,
                permission,
                images,
            );
        } else {
            this.updateAlbum(
                { ...currentAlbum },
                currentUser,
                description,
                mappedPhotos[0].url,
                parsedAlbum,
                accessUserList,
                permission,
                images,
            );
        }
    };

    /**
     * Create new album
     */
    createAlbum = (
        currentUser: Map<string, any>,
        description: string,
        url: string,
        album: Album,
        accessUserList: string[],
        permission: UserPermissionType,
        images: Media[],
    ) => {
        const { post } = this.props;
        const newPost = new Post(
            '0',
            PostType.Album,
            moment().utc().valueOf(),
            0,
            0,
            {},
            0,
            {},
            description,
            currentUser.get('userId'),
            currentUser.get('fullName'),
            currentUser.get('avatar'),
            0,
            [],
            0,
            url,
            '',
            '',
            '',
            album,
            false,
            false,
            false,
            accessUserList,
            permission,
            config.dataFormat.postVersion,
        );
        if (post) {
            post(newPost, images);
        }
    };

    /**
     * Create new album
     */
    updateAlbum = (
        currentPostAlbum: Post,
        currentUser: Map<string, any>,
        description: string,
        url: string,
        album: Album,
        accessUserList: string[],
        permission: UserPermissionType,
        images: Media[],
    ) => {
        const { post } = this.props;
        currentPostAlbum.body = description;
        currentPostAlbum.image = url;
        currentPostAlbum.album = album;
        currentPostAlbum.accessUserList = accessUserList;
        currentPostAlbum.permission = permission;
        if (post) {
            post(currentPostAlbum, images);
        }
    };

    /**
     * Handle change step
     */
    handleStepChange = (activeStep: number) => {
        this.setState({ activeStep });
    };

    /**
     * Handle on change file upload
     */
    onFileChange = (event: any) => {
        const selectedPhotos = [...this.state.selectedPhotos];

        const { files } = event.currentTarget;
        const parsedFiles: { src: string; file: any; fileName: string }[] = [];
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const file = files[fileIndex];
            const extension = FileAPI.getExtension(file.name);
            const fileName = `${uuid()}.${extension}`;
            parsedFiles.push({ src: URL.createObjectURL(file), fileName, file });
        }
        const joinedPhotos = [...selectedPhotos, ...parsedFiles];

        this.setState({
            selectedPhotos: joinedPhotos,
        });
        event.currentTarget.value = null;
    };

    /**
     * Delete selected photo
     */
    deleteSelectedPhoto = (fileName: string) => {
        this.setState((prevState) => {
            let selectedPhotos = [...prevState.selectedPhotos];
            selectedPhotos = selectedPhotos.filter((photo) => photo.fileName !== fileName);
            return {
                selectedPhotos,
            };
        });
    };

    /**
     * Get permission label
     */
    getPermissionLabel = () => {
        const { t } = this.props;
        const { permission } = this.state;
        if (!t) {
            return '';
        }
        let permissionLabel = '';
        if (permission === UserPermissionType.Public) {
            permissionLabel = t('permission.public');
        } else if (permission === UserPermissionType.Circles) {
            permissionLabel = t('permission.circles');
        } else if (permission === UserPermissionType.OnlyMe) {
            permissionLabel = t('permission.onlyMe');
        }
        return permissionLabel;
    };

    /**
     * Hide image gallery
     */
    close = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    /**
     * Image list
     */
    imageList = () => {
        const { classes, progress } = this.props;
        const { selectedPhotos } = this.state;
        return selectedPhotos.map((photo) => {
            const progressPercent = progress.getIn([photo.fileName, 'percent'], 0) as number;
            const progressVisible = progress.getIn([photo.fileName, 'visible'], true) as boolean;

            return (
                <ImageListItem key={`album-dialog-tile-${photo.fileName}`}>
                    <img src={photo.file} alt={'something'} />
                    <ImageListItemBar
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
                </ImageListItem>
            );
        });
    };

    /**
     * Render Grid tile
     */
    gridTile = () => {
        const { classes } = this.props;
        return (
            <div className={classes.gridTileRoot}>
                <ImageList rowHeight={180} className={classes.ImageList}>
                    <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }} />
                    {this.imageList()}
                </ImageList>
            </div>
        );
    };

    render() {
        const { t, classes, theme, open, onClose, createAlbumRequestStatus } = this.props;
        const {
            activeStep,
            nextDisabled,
            selectedPhotos,
            description,
            descriptionError,
            albumNameError,
            albumName,
            permissionOpen,
            permission,
            saveDisabled,
        } = this.state;
        const maxSteps = tutorialSteps.length;
        const loading = createAlbumRequestStatus === ServerRequestStatusType.Sent;
        return (
            <Dialog
                id={'album-dialog-'}
                open={open}
                classes={{ paper: classes.paper }}
                onClose={onClose}
                TransitionComponent={Transition}
            >
                <input
                    accept="image/*"
                    className={classes.input}
                    id="album-dialog-button-file"
                    multiple
                    onChange={this.onFileChange}
                    type="file"
                />
                <div className={classes.root}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography>{tutorialSteps[activeStep].label}</Typography>
                        <IconButton color="inherit" onClick={onClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        {activeStep === 0 ? (
                            <label htmlFor="album-dialog-button-file">
                                <Button component="span" color="primary">
                                    <AddPhotoIcon />
                                    {t('album.addPhotos')}
                                </Button>
                            </label>
                        ) : (
                            <Typography variant={'h6'}> {t('album.saveAlbum')} </Typography>
                        )}
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.activeStep}
                        onChangeIndex={this.handleStepChange}
                        enableMouseEvents
                    >
                        {this.gridTile()}
                        <div className={classes.information}>
                            <Fab onClick={this.handleTogglePermission} className={classes.button}>
                                <LockIcon />
                                {this.getPermissionLabel()}
                            </Fab>
                            <div style={{ height: 40 }} />

                            <TextField
                                autoFocus={activeStep === 1}
                                value={albumName}
                                onChange={this.handleChange('albumName')}
                                placeholder={t('album.albumTitle')}
                                error={!StringAPI.isEmpty(albumNameError)}
                                helperText={albumNameError}
                            />
                            <div style={{ height: 40 }} />
                            <TextField
                                value={description}
                                onChange={this.handleChange('description')}
                                placeholder={t('album.description')}
                                multiline
                                rows={2}
                                maxRows={4}
                                style={{
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    flexShrink: 0,
                                    width: 'initial',
                                    flexGrow: 1,
                                }}
                                error={!StringAPI.isEmpty(descriptionError)}
                                helperText={descriptionError}
                            />
                        </div>
                    </SwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        position="bottom"
                        activeStep={activeStep}
                        className={classes.mobileStepper}
                        nextButton={
                            activeStep !== maxSteps - 1 ? (
                                <>
                                    <Button
                                        size="small"
                                        disabled={nextDisabled || !(selectedPhotos.length > 0)}
                                        onClick={this.handleNext}
                                    >
                                        {t('album.next')}{' '}
                                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                    </Button>
                                </>
                            ) : (
                                <div className={classes.wrapper}>
                                    <Button
                                        size="small"
                                        variant={'contained'}
                                        disabled={
                                            loading ||
                                            saveDisabled ||
                                            !StringAPI.isEmpty(albumNameError) ||
                                            !StringAPI.isEmpty(descriptionError)
                                        }
                                        color="secondary"
                                        onClick={this.saveAlbum}
                                    >
                                        {t('album.save')}
                                    </Button>
                                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </div>
                            )
                        }
                        backButton={
                            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                {t('album.back')}
                            </Button>
                        }
                    />
                </div>
                <UserPermissionComponent
                    onClose={this.handleTogglePermission}
                    open={permissionOpen}
                    onAddAccessList={this.handleAccessList}
                    access={permission}
                />
            </Dialog>
        );
    }
}

export default connectAlbumDialog(AlbumDialogComponent);
