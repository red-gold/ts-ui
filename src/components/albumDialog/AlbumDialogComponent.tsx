// - Impoer react components
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import GridList from '@material-ui/core/GridList';
import Fab from '@material-ui/core/Fab';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import CloseIcon from '@material-ui/icons/Close';
import SvgDelete from '@material-ui/icons/Delete';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LockIcon from '@material-ui/icons/VpnLock';
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
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import uuid from 'uuid';
import { TransitionProps } from '@material-ui/core/transitions';
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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Create component class
 */
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

    /**
     * Component constructor
     *
     */
    constructor(props: IAlbumDialogProps & WithTranslation) {
        super(props);

        this.state = {
            acceptedFiles: [],
            rejectedFiles: [],
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
     * Handle change input
     */
    handleChange = (name: string) => (event: any) => {
        const { t } = this.props;
        const targetValue = event.target.value;
        let error: any = null;
        if (StringAPI.isEmpty(targetValue)) {
            error = t(`album.${name}Error`);
        }
        this.setState(() => {
            return {
                [name]: targetValue,
                [`${name}Error`]: error,
                saveDisabled: !StringAPI.isEmpty(error),
            };
        });
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
            const meta = progress.getIn([photo.fileName, 'meta'], { url: '' });
            const fileId = photo.fileName.split('.')[0];
            const image = new Media(
                fileId,
                0,
                0,
                URL.createObjectURL(photo.src),
                URL.createObjectURL(photo.src),
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

        const files: File[] = event.currentTarget.files;
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
        let selectedPhotos = [...this.state.selectedPhotos];
        selectedPhotos = selectedPhotos.filter((photo) => photo.fileName !== fileName);
        this.setState({
            selectedPhotos,
        });
    };

    onDrop(acceptedFiles: any[], rejectedFiles: any[]) {
        this.setState({ acceptedFiles, rejectedFiles });
    }

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
            const progressPercent = progress.getIn([photo.fileName, 'percent'], 0);
            const progressVisible = progress.getIn([photo.fileName, 'visible'], true);

            return (
                <GridListTile key={`album-dialog-tile-${photo.fileName}`}>
                    <img src={photo.file} alt={'something'} />
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
            <div className={classes.gridTileRoot}>
                <GridList cellHeight={180} className={classes.gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}></GridListTile>
                    {this.imageList()}
                </GridList>
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
                            <div style={{ height: 40 }}></div>

                            <TextField
                                autoFocus={activeStep === 1}
                                value={albumName}
                                onChange={this.handleChange('albumName')}
                                placeholder={t('album.albumTitle')}
                                error={!StringAPI.isEmpty(albumNameError)}
                                helperText={albumNameError}
                            />
                            <div style={{ height: 40 }}></div>
                            <TextField
                                value={description}
                                onChange={this.handleChange('description')}
                                placeholder={t('album.description')}
                                multiline
                                rows={2}
                                rowsMax={4}
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
