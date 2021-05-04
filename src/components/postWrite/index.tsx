// - Import react components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SvgCamera from '@material-ui/icons/PhotoCamera';
import SvgPlay from '@material-ui/icons/PlayCircleFilled';
import SvgRemoveImage from '@material-ui/icons/RemoveCircle';
import SvgAddVideo from '@material-ui/icons/VideoCall';
import VideoGalleryIcon from '@material-ui/icons/VideoLibrary';
import FileAPI from 'api/FileAPI';
import * as PostAPI from 'api/PostAPI';
import StringAPI from 'api/StringAPI';
import classNames from 'classnames';
import AddVideo from 'components/addVideo/AddVideoComponent';
import AlbumDialogComponent from 'components/albumDialog/AlbumDialogComponent';
import Img from 'components/img';
import PostImageUploadComponent from 'components/postImageUpload';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import UserPermissionComponent from 'components/userPermission/UserPermissionComponent';
import VideoGalleryComponent from 'components/videoGallery/VideoGalleryComponent';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Album } from 'core/domain/imageGallery/album';
import { PostType } from 'core/domain/posts/postType';
import { fromJS, List as ImuList, Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import uuid from 'uuid';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment/moment';
import config from 'config';

import { connectPostWrite } from './connectPostWrite';
import { IPostWriteProps } from './IPostWriteProps';
import { IPostWriteState } from './IPostWriteState';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { Post } from 'core/domain/posts/post';

export class PostWriteComponent extends Component<IPostWriteProps & WithTranslation, IPostWriteState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IPostWriteProps & WithTranslation) {
        super(props);

        const { postModel } = props;

        const albumPhotos: ImuList<any> = postModel && postModel.getIn(['album', 'photos'], ImuList([]));
        const selectedPhotos: any[] =
            props.edit && postModel && postModel.get('postTypeId', 0) === PostType.PhotoGallery
                ? albumPhotos
                      .map((photo) => {
                          return Map({ src: photo, fileName: photo, loaded: true });
                      })
                      .toJS()
                : [];
        console.log('=======>>> Selected photos ', selectedPhotos);
        // Default state
        this.state = {
            /**
             * Post text
             */
            postText: this.props.edit && postModel ? postModel.get('body', '') : '',
            /**
             * The URL image of the post
             */
            image: this.props.edit && postModel ? postModel.get('image', '') : '',
            /**
             * The path identifier of image on the server
             */
            imageFullPath: this.props.edit && postModel ? postModel.get('imageFullPath', '') : '',
            /**
             * Whether menu is open
             */
            menuOpen: false,
            /**
             * If it's true post button will be disabled
             */
            disabledPost: true,
            /**
             * If it's true comment will be disabled on post
             */
            disableComments: this.props.edit && postModel ? postModel.get('disableComments', false) : false,
            /**
             * If it's true share will be disabled on post
             */
            disableSharing: this.props.edit && postModel ? postModel.get('disableSharing', false) : false,
            /**
             * Whether video dialog is open
             */
            videoLinkOpen: false,
            /**
             * Whether video gallery dialog is open
             */
            videoGalleryOpen: false,
            /**
             * Whether video gallery dialog is open
             */
            permissionOpen: false,
            /**
             * The URL video of the post
             */
            video: this.props.edit && postModel ? postModel.get('video', '') : '',
            /**
             * The address of video thumbnails on the post
             */
            thumbnail: this.props.edit && postModel ? postModel.get('thumbnail', '') : '',
            /**
             * Post content type
             */
            postType: this.props.edit && postModel ? postModel.get('postTypeId', PostType.Text) : PostType.Text,
            /**
             * The list of user can access to post
             */
            accessUserList: this.props.edit && postModel ? postModel.get('accessUserList', []) : [],
            /**
             * User permission type
             */
            permission:
                this.props.edit && postModel
                    ? postModel.get('permission', UserPermissionType.Public)
                    : UserPermissionType.Public,
            /**
             * Selected photos
             */
            selectedPhotos: selectedPhotos,
            /**
             * Album
             */
            album:
                this.props.edit && postModel
                    ? postModel.get('album', Map({ photos: ImuList([]) }))
                    : Map({ photos: ImuList([]) }),
        };

        // Binding functions to `this`
        this.handleOnChange = this.handleOnChange.bind(this);
        this.onRequestSetImage = this.onRequestSetImage.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.handleToggleComments = this.handleToggleComments.bind(this);
        this.handleToggleSharing = this.handleToggleSharing.bind(this);
        this.handleTogglePermission = this.handleTogglePermission.bind(this);
        this.isPostChangeValid = this.isPostChangeValid.bind(this);
        this.getPermissionLabel = this.getPermissionLabel.bind(this);
        this.onUploadAlbumChange = this.onUploadAlbumChange.bind(this);
        this.handleDeletePhoto = this.handleDeletePhoto.bind(this);
    }

    /**
     * Toggle comments of the post to disable/enable
     */
    handleToggleComments = () => {
        this.setState((prevState) => ({
            disableSharing: !prevState.disableComments,
            disabledPost: !this.isPostChangeValid(prevState),
        }));
    };

    /**
     * Toggle sharing of the post to disable/enable
     */
    handleToggleSharing = () => {
        this.setState((prevState) => ({
            disableSharing: !prevState.disableSharing,
            disabledPost: !this.isPostChangeValid(prevState),
        }));
    };

    /**
     * Toggle Permission dialog
     */
    handleTogglePermission = () => {
        this.setState((prevState) => ({
            permissionOpen: !prevState.permissionOpen,
            disabledPost: !this.isPostChangeValid(prevState),
        }));
    };

    /**
     * Romove the image of post
     */
    handleRemoveImage = () => {
        this.setState((prevState) => ({
            image: '',
            video: '',
            imageFullPath: '',
            postType: PostType.Text,
            disabledPost: !this.isPostChangeValid(prevState),
        }));
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

    handleClosePostAlbum = () => {};

    /**
     * Handle send post to the server
     */
    handlePost = () => {
        this.setState({
            disabledPost: false,
        });
        const {
            image,
            imageFullPath,
            disableComments,
            disableSharing,
            postText,
            video,
            thumbnail,
            postType,
            accessUserList,
            selectedPhotos,
            permission,
        } = this.state;

        const { currentUser, edit, post, update, postModel } = this.props;
        if (!this.isPostChangeValid(this.state)) {
            this.setState({
                disabledPost: true,
            });
            return undefined;
        }

        const tags = PostAPI.getContentTags(postText);

        const albumPhotos: Album = new Album();
        const files: {
            src: string;
            file: any;
            fileName: string;
        }[] = [];

        selectedPhotos.forEach((photo) => {
            if (photo.file) {
                files.push(photo);
            } else {
                albumPhotos.photos.push(photo.src);
            }
        });

        // In edit status we should fire update if not we should fire post function

        const nowDate = moment().utc().valueOf();
        const newPost: Post = {
            postTypeId: postType || 0,
            creationDate: nowDate,
            deleteDate: 0,
            score: 0,
            viewCount: 0,
            body: postText,
            ownerUserId: currentUser.get('userId'),
            ownerDisplayName: currentUser.get('fullName'),
            ownerAvatar: currentUser.get('avatar'),
            lastEditDate: nowDate,
            album: { ...albumPhotos },
            tags: tags || [],
            commentCounter: 0,
            image: image || '',
            imageFullPath: imageFullPath || '',
            video: video || '',
            thumbnail: thumbnail || '',
            disableComments: disableComments || false,
            disableSharing: disableSharing || false,
            accessUserList: accessUserList || [],
            permission: permission || UserPermissionType.Public,
            deleted: false,
            version: config.dataFormat.postVersion,
        };

        if (!edit) {
            post(newPost, files);
        } else if (postModel) {
            // In edit status we pass post to update functions
            const updatedPost = postModel
                .set('body', postText)
                .set('tags', ImuList(tags))
                .set('image', image)
                .set('imageFullPath', imageFullPath)
                .set('video', video)
                .set('album', fromJS({ ...albumPhotos }))
                .set('thumbnail', thumbnail)
                .set('disableComments', disableComments)
                .set('disableSharing', disableSharing)
                .set('postTypeId', postType)
                .set('accessUserList', ImuList(accessUserList))
                .set('permission', permission);

            update(updatedPost, files);
        }
    };

    /**
     * Set post image url
     */
    onRequestSetImage = (url: string) => {
        this.setState({
            image: url,
            video: '',
            postType: PostType.Photo,
            disabledPost: false,
        });
    };

    /**
     * Set post video url
     */
    onSetVideo = (url: string, thumbnail: string) => {
        this.setState({
            image: '',
            thumbnail,
            video: url,
            postType: PostType.Video,
            disabledPost: false,
        });
    };

    /**
     * When the post text changed
     */
    handleOnChange = (event: any) => {
        const data = event.target.value;
        const { selectedPhotos } = this.state;
        if (
            (data.length === 0 || data.trim() === '' || (this.props.edit && data.trim() === this.props.text)) &&
            !selectedPhotos.length
        ) {
            this.setState({
                postText: data,
                disabledPost: true,
            });
        } else {
            this.setState({
                postText: data,
                disabledPost: false,
            });
        }
    };

    /**
     * Open add video link dialog
     */
    handleOpenVideoLink = () => {
        this.setState({
            videoLinkOpen: true,
        });
    };

    /**
     * Clode add video link dialog
     */
    handleCloseVideoLink = () => {
        this.setState({
            videoLinkOpen: false,
        });
    };

    /**
     * Open add video gallery dialog
     */
    handleOpenVideoGallery = () => {
        this.setState({
            videoGalleryOpen: true,
        });
    };

    /**
     * Clode add video gallery dialog
     */
    handleCloseVideoGallery = () => {
        this.setState({
            videoGalleryOpen: false,
        });
    };

    /**
     * Handle open more menu
     */
    handleOpenMenu = (event: any) => {
        this.setState({
            menuOpen: true,
            menuAnchorEl: event.currentTarget,
        });
    };

    /**
     * Handle close more menu
     */
    handleCloseMenu = () => {
        this.setState({
            menuOpen: false,
            menuAnchorEl: null,
        });
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
     * Handle delete photo
     */
    handleDeletePhoto = (fileName: string) => {
        const { selectedPhotos, postText } = this.state;
        const updatedPhotos: {
            src: string;
            file: any;
            fileName: string;
        }[] = [];
        selectedPhotos.forEach((photo) => {
            if (fileName !== photo.fileName) {
                updatedPhotos.push(photo);
            }
        });
        let disabledPost = true;
        const textCondition =
            postText.length === 0 || postText.trim() === '' || (this.props.edit && postText.trim() === this.props.text);
        if ((updatedPhotos && updatedPhotos.length > 0) || !textCondition) {
            disabledPost = false;
        }
        this.setState({
            selectedPhotos: [...updatedPhotos],
            disabledPost,
        });
    };

    /**
     * Handle on change file upload
     */
    onUploadAlbumChange = (event: any) => {
        const { selectedPhotos } = this.state;

        const files: File[] = event.currentTarget.files;
        const parsedFiles: { src: string; fileName: string; file: File }[] = [];
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const file = files[fileIndex];
            const extension = FileAPI.getExtension(file.name);
            const fileName = `${uuid()}.${extension}`;
            parsedFiles.push({ src: URL.createObjectURL(file), fileName, file });
        }
        const photos = [...selectedPhotos, ...parsedFiles];

        // TODO: add upload album dialog
        // if (files.length > 3) {
        //     this.openAlbumDialog();
        // } else {
        // }
        this.setState({
            selectedPhotos: [...photos],
            disabledPost: false,
            postType: PostType.PhotoGallery,
        });
        event.currentTarget.value = null;
    };

    /**
     * Is post change valid
     */
    isPostChangeValid = (prevState: IPostWriteState) => {
        const { image, video, postText, selectedPhotos } = prevState;

        return (
            !StringAPI.isEmpty(image) ||
            !StringAPI.isEmpty(video) ||
            !StringAPI.isEmpty(postText) ||
            (selectedPhotos && selectedPhotos.length > 0)
        );
    };

    /**
     * Get permission label
     */
    getPermissionLabel = () => {
        const { t } = this.props;
        const { permission } = this.state;
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

    componentWillUnmount() {
        const { setPostWriteModel } = this.props;
        setPostWriteModel(null);
    }
    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t, progress, albumDialogOpen, currentUser, updatePostRequestStatus } = this.props;
        const {
            menuOpen,
            videoLinkOpen,
            image,
            postType,
            selectedPhotos,
            thumbnail,
            permissionOpen,
            permission,
            menuAnchorEl,
        } = this.state;
        const albumOpen = albumDialogOpen !== undefined ? albumDialogOpen : false;
        const rightIconMenu = (
            <div>
                <Tooltip id="tooltip-icon" title={t('post.moreTooltip') as string} placement="bottom-start">
                    <IconButton onClick={this.handleOpenMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    open={menuOpen}
                    anchorEl={menuAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={this.handleCloseMenu}
                >
                    <MenuItem onClick={this.handleToggleComments} style={{ fontSize: '14px' }}>
                        {!this.state.disableComments ? t('post.disableComments') : t('post.enableComments')}{' '}
                    </MenuItem>
                    <MenuItem onClick={this.handleToggleSharing} style={{ fontSize: '14px' }}>
                        {!this.state.disableSharing ? t('post.disableSharing') : t('post.disableSharing')}
                    </MenuItem>
                </Menu>
            </div>
        );
        const postAvatar = (
            <UserAvatarComponent
                fullName={currentUser.get('fullName', '')}
                fileName={currentUser.get('avatar', '')}
                size={36}
            />
        );

        const author = (
            <div className={classes.author}>
                <span
                    style={{
                        fontSize: '14px',
                        paddingRight: '10px',
                        fontWeight: 400,
                        color: 'rgba(0,0,0,0.87)',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        lineHeight: '25px',
                    }}
                >{`${currentUser.get('fullName')} |`}</span>
                <span
                    onClick={this.handleTogglePermission}
                    className={classNames(classes.permission, classes.disableComponent)}
                >
                    {`${this.getPermissionLabel()}`}
                </span>
            </div>
        );

        /**
         * Provide post image
         */
        const loadImage =
            (image && image !== '' && postType === PostType.Photo) ||
            (thumbnail && thumbnail !== '' && postType === PostType.Video) ? (
                <div>
                    <div style={{ position: 'relative', overflowY: 'hidden', overflowX: 'auto' }}>
                        <ul
                            style={{
                                position: 'relative',
                                whiteSpace: 'nowrap',
                                padding: '0 0 0 16px',
                                margin: '8px 0 0 0',
                                paddingRight: '16px',
                                verticalAlign: 'bottom',
                                flexShrink: 0,
                                listStyleType: 'none',
                            }}
                        >
                            <div style={{ display: 'flex', position: 'relative' }}>
                                <span
                                    onClick={this.handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        width: '28px',
                                        backgroundColor: 'rgba(6, 6, 6, 0.82)',
                                        height: '28px',
                                        right: 12,
                                        top: 4,
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <SvgRemoveImage style={{ color: 'rgba(239, 235, 235, 0.83)' }} />
                                </span>
                                <span
                                    className={classNames(classes.playVideo, {
                                        [classes.noDisplay]: postType !== PostType.Video,
                                    })}
                                    style={{}}
                                >
                                    <SvgPlay className={classes.playIcon} />
                                </span>

                                <div
                                    style={{
                                        display: 'inline-block',
                                        width: '100%',
                                        marginRight: '8px',
                                        transition: 'transform .25s',
                                    }}
                                >
                                    <li
                                        style={{
                                            width: '100%',
                                            margin: 0,
                                            verticalAlign: 'bottom',
                                            position: 'static',
                                        }}
                                    >
                                        <Img
                                            fileName={postType === PostType.Photo ? image : thumbnail}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </li>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            ) : (
                ''
            );
        const inprogress = updatePostRequestStatus === ServerRequestStatusType.Sent;

        return (
            <div style={this.props.style}>
                {this.props.children}
                <Dialog
                    BackdropProps={{ className: classes.backdrop } as any}
                    PaperProps={{ className: classes.fullPageXs }}
                    key={this.props.id || 0}
                    open={this.props.postWriteOpen}
                    onClose={this.props.onRequestClose}
                >
                    {inprogress && (
                        <div className={classes.inprogress}>
                            <CircularProgress color="secondary" />
                        </div>
                    )}
                    <DialogTitle className={classes.dialogTitle}>
                        <CardHeader title={author} avatar={postAvatar} action={rightIconMenu}></CardHeader>
                    </DialogTitle>
                    <DialogContent className={classes.content} style={{ paddingTop: 0 }}>
                        <Card elevation={0}>
                            <CardContent>
                                <Grid item xs={12}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                        <div
                                            style={{
                                                position: 'relative',
                                                flexDirection: 'column',
                                                display: 'flex',
                                                flexGrow: 1,
                                                overflowY: 'auto',
                                                maxHeight: '300px',
                                            }}
                                        >
                                            <TextField
                                                autoFocus
                                                value={this.state.postText}
                                                onChange={this.handleOnChange}
                                                placeholder={t('post.textareaPlaceholder')}
                                                multiline
                                                rows={2}
                                                rowsMax={4}
                                                style={{
                                                    fontWeight: 400,
                                                    fontSize: '14px',
                                                    margin: '0 16px',
                                                    flexShrink: 0,
                                                    width: 'initial',
                                                    flexGrow: 1,
                                                }}
                                            />

                                            {loadImage}
                                            {selectedPhotos.length > 0 && (
                                                <PostImageUploadComponent
                                                    photos={selectedPhotos}
                                                    progress={progress}
                                                    onDelete={this.handleDeletePhoto}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Grid>
                            </CardContent>
                        </Card>
                    </DialogContent>
                    <DialogActions className={classes.iconButtonsRoot}>
                        <div style={{ flexShrink: 0, boxFlex: 0, flexGrow: 0, maxHeight: '48px', width: '100%' }}>
                            <div style={{ flexDirection: 'row', display: 'flex' }}>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="album-button-file"
                                    multiple
                                    onChange={this.onUploadAlbumChange}
                                    type="file"
                                />
                                <div
                                    style={{
                                        outline: 'none',
                                        width: '48px',
                                        zIndex: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        textAlign: 'center',
                                        transition: 'background .3s',
                                        border: 0,
                                        borderRadius: '50%',
                                        display: 'inlineBlock',
                                        height: '48px',
                                    }}
                                >
                                    <span
                                        style={{
                                            top: '15px',
                                            display: 'block',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <label htmlFor="album-button-file">
                                            <SvgCamera style={{ color: 'grey' }} />
                                        </label>
                                    </span>
                                </div>
                                <div
                                    onClick={this.handleOpenVideoLink}
                                    style={{
                                        outline: 'none',
                                        width: '48px',
                                        zIndex: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        textAlign: 'center',
                                        transition: 'background .3s',
                                        border: 0,
                                        borderRadius: '50%',
                                        display: 'inlineBlock',
                                        height: '48px',
                                    }}
                                >
                                    <span
                                        style={{
                                            top: '12px',
                                            display: 'block',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <SvgAddVideo style={{ color: 'grey', width: 30, height: 30 }} />
                                    </span>
                                </div>
                                <div
                                    className={classes.disableComponent}
                                    onClick={this.handleOpenVideoGallery}
                                    style={{
                                        outline: 'none',
                                        width: '48px',
                                        zIndex: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        textAlign: 'center',
                                        transition: 'background .3s',
                                        border: 0,
                                        borderRadius: '50%',
                                        display: 'inlineBlock',
                                        height: '48px',
                                    }}
                                >
                                    <span
                                        style={{
                                            top: '14px',
                                            display: 'block',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <VideoGalleryIcon style={{ color: 'grey', width: 24, height: 24 }} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogActions>
                    <DialogActions>
                        <Button
                            color="primary"
                            disableFocusRipple={true}
                            disableRipple={true}
                            onClick={this.props.onRequestClose}
                            style={{ color: grey[800] }}
                        >
                            {t('post.cancelButton')}
                        </Button>
                        <Button
                            color="primary"
                            disableFocusRipple={true}
                            disableRipple={true}
                            onClick={this.handlePost}
                            disabled={this.state.disabledPost}
                        >
                            {this.props.edit ? t('post.updateButton') : t('post.postButton')}
                        </Button>
                    </DialogActions>
                </Dialog>

                {albumOpen && progress ? (
                    <AlbumDialogComponent
                        open={albumOpen}
                        progress={progress}
                        photos={selectedPhotos}
                        onClose={this.closeAlbumDialog}
                    />
                ) : (
                    ''
                )}

                {/* Video gallery Modal*/}
                <Dialog
                    PaperProps={{ className: classNames(classes.fullPageXs, classes.videoGallery) }}
                    open={this.state.videoGalleryOpen}
                    onClose={this.handleCloseVideoGallery}
                >
                    <DialogActions className={classes.galleryActions}>
                        <Typography variant={'h6'} component={'div'} className={classes.galleryDialogTitle}>
                            <VideoGalleryIcon
                                style={{ color: 'rgb(230, 35, 35)', margin: '0 10px', width: 24, height: 24 }}
                            />
                            {t('post.videoGalleryLabel')}
                        </Typography>
                        <IconButton onClick={this.handleCloseVideoGallery}>
                            <CloseIcon />
                        </IconButton>
                    </DialogActions>
                    <Divider className={classes.devider} />
                    <DialogContent>
                        <VideoGalleryComponent set={this.onSetVideo} close={this.handleCloseVideoGallery} />
                    </DialogContent>
                </Dialog>

                <AddVideo open={videoLinkOpen} onClose={this.handleCloseVideoLink} onAddLink={this.onSetVideo} />
                <UserPermissionComponent
                    onClose={this.handleTogglePermission}
                    open={permissionOpen}
                    onAddAccessList={this.handleAccessList}
                    access={permission}
                />
            </div>
        );
    }
}

export default connectPostWrite(PostWriteComponent);
