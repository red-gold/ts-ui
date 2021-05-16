import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CommentIcon from '@material-ui/icons/CommentRounded';
import LikeIcon from '@material-ui/icons/FavoriteRounded';
import SvgFavoriteBorder from '@material-ui/icons/FavoriteBorderRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SvgPlay from '@material-ui/icons/PlayCircleFilled';
import ShareIcon from '@material-ui/icons/ShareRounded';
import classNames from 'classnames';
import CommentGroup from 'components/commentGroup/CommentGroupComponent';
import Img from 'components/img';
import ReadMoreComponent from 'components/readMore';
import ShareDialog from 'components/shareDialog';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import copy from 'copy-to-clipboard';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { PostType } from 'core/domain/posts/postType';
import PostAlbumComponent from 'layouts/postAlbum';
import moment from 'moment/moment';
import * as R from 'ramda';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player';
import { NavLink } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import config from 'config';

import { connectPost } from './connectPost';
import { IPostProps } from './IPostProps';
import { IPostState } from './IPostState';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const DisplayName = styled(NavLink)({
    color: '#212b36',
    textTransform: 'capitalize',
});

const Link = styled(NavLink)({});
export class PostComponent extends Component<IPostProps & WithTranslation, IPostState> {
    styles = {
        dialog: {
            width: '',
            maxWidth: '530px',
            borderRadius: '4px',
        },
    };

    constructor(props: IPostProps & WithTranslation) {
        super(props);
        const { post } = props;
        this.state = {
            /**
             * Post text
             */
            text: post.get('body', ''),
            /**
             * It's true if whole the text post is visible
             */
            readMoreState: false,
            /**
             * Handle open comment from parent component
             */
            openComments: false,
            /**
             * If it's true, share dialog will be open
             */
            shareOpen: false,
            /**
             * If it's true comment will be disabled on post
             */
            disableComments: post.get('disableComments'),
            /**
             * If it's true share will be disabled on post
             */
            disableSharing: post.get('disableSharing'),
            /**
             * Title of share post
             */
            shareTitle: 'Share On',
            /**
             * If it's true, post link will be visible in share post dialog
             */
            openCopyLink: false,
            /**
             * Post menu anchor element
             */
            postMenuAnchorEl: null,
            /**
             * Whether post menu open
             */
            isPostMenuOpen: false,
            /**
             * Whether video display
             */
            showVideo: false,
        };

        // Binding functions to this
        this.handleReadMore = this.handleReadMore.bind(this);
        this.getOpenCommentGroup = this.getOpenCommentGroup.bind(this);
        this.handleVote = this.handleVote.bind(this);
        this.handleOpenShare = this.handleOpenShare.bind(this);
        this.handleCloseShare = this.handleCloseShare.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpenComments = this.handleOpenComments.bind(this);
        this.rightIconMenu = this.rightIconMenu.bind(this);
        this.handleEditPost = this.handleEditPost.bind(this);
    }

    /**
     * Toggle on show/hide comment
     */
    handleOpenComments = () => {
        if (!this.state.openComments) {
            const { getPostComments, post } = this.props;
            const ownerUserId = post.get('ownerUserId');
            const id = post.get('id');
            getPostComments(ownerUserId, id, 0, 10);
        }
        this.setState({
            openComments: !this.state.openComments,
        });
    };

    /**
     * Delete a post
     */
    handleDelete = () => {
        const { post } = this.props;
        this.closePostMenu();
        if (this.props.delete) {
            this.props.delete(post.get('id'));
        }
    };

    /**
     * Handle edit a post
     */
    handleEditPost = () => {
        const { post, openPostWrite, setPostWriteModel } = this.props;
        setPostWriteModel(post);
        openPostWrite();
    };

    /**
     * Open post menu
     */
    openPostMenu = (event: any) => {
        this.setState({
            postMenuAnchorEl: event.currentTarget,
            isPostMenuOpen: true,
        });
    };

    /**
     * Close post menu
     */
    closePostMenu = () => {
        this.setState({
            postMenuAnchorEl: null,
            isPostMenuOpen: false,
        });
    };

    /**
     * Show copy link
     */
    handleCopyLink = () => {
        const { t } = this.props;
        this.setState({
            openCopyLink: true,
            shareTitle: t('post.copyLinkButton'),
        });
    };

    /**
     * Open share post
     */
    handleOpenShare = () => {
        const { post } = this.props;
        copy(`${window.location.origin}/${post.get('ownerUserId')}/posts/${post.get('id')}`);
        this.setState({
            shareOpen: true,
        });
    };

    /**
     * Close share post
     */
    handleCloseShare = () => {
        this.setState({
            shareOpen: false,
            shareTitle: 'Share On',
            openCopyLink: false,
        });
    };

    /**
     * Handle vote on a post
     */
    handleVote = () => {
        const { unvote, vote, currentUserVote } = this.props;
        if (!vote || !unvote) {
            return;
        }
        if (currentUserVote) {
            unvote();
        } else {
            vote();
        }
    };

    /**
     * Set open comment group function on state which passed by CommentGroup component
     */
    getOpenCommentGroup = (open: () => void) => {
        this.setState({
            openCommentGroup: open,
        });
    };

    /**
     * Handle read more event
     */
    handleReadMore() {
        this.setState({
            readMoreState: !this.state.readMoreState,
        });
    }

    /**
     * Handle on displaying video
     */
    onShowVideo = () => {
        this.setState({
            showVideo: true,
        });
    };

    /**
     * Get permission label
     */
    getPermissionLabel = () => {
        const { t, post } = this.props;
        const permission = post.get('permission');
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

    shouldComponentUpdate(nextProps: IPostProps, nextState: IPostState) {
        let shouldUpdate = false;

        if (!nextProps.post.equals(this.props.post)) {
            shouldUpdate = true;
        } else if (nextProps.commentList !== this.props.commentList) {
            shouldUpdate = true;
        } else if (this.props.getPostComments !== nextProps.getPostComments) {
            shouldUpdate = true;
        } else if (!R.equals(this.state, nextState)) {
            shouldUpdate = true;
        }
        return shouldUpdate;
    }

    /**
     * Right Image Icon
     */
    rightIconMenu = () => {
        const { post, t, toggleDisableComments, toggleSharingComments } = this.props;
        const { postMenuAnchorEl, isPostMenuOpen } = this.state;

        return (
            <div>
                <IconButton onClick={this.openPostMenu.bind(this)}>
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    open={isPostMenuOpen || false}
                    anchorEl={postMenuAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={this.closePostMenu}
                >
                    {post.get('postTypeId') !== PostType.Album && (
                        <MenuItem onClick={this.handleEditPost}> {t('post.edit')} </MenuItem>
                    )}
                    <MenuItem onClick={this.handleDelete}> {t('post.delete')} </MenuItem>
                    <MenuItem onClick={() => toggleDisableComments(!post.get('disableComments'))}>
                        {post.get('disableComments') ? t('post.enableComments') : t('post.disableComments')}
                    </MenuItem>
                    <MenuItem onClick={() => toggleSharingComments(!post.get('disableSharing'))}>
                        {post.get('disableSharing') ? t('post.enableSharing') : t('post.disableSharing')}
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    getAlbum() {
        const { post } = this.props;
        const album: Map<string, any> = post.get('album');
        const id = post.get('id');
        const postTypeId = post.get('postTypeId');

        if (album && album.get('photos') && (postTypeId === PostType.Album || postTypeId === PostType.PhotoGallery)) {
            return (
                <PostAlbumComponent key={`post-album-grid-${id}`} currentAlbum={post} images={album.get('photos')} />
            );
        }

        return '';
    }
    /**
     * Reneder component DOM
     */
    render() {
        const { post, setHomeTitle, goTo, isPostOwner, commentList, classes } = this.props;
        const { showVideo } = this.state;

        const ownerUserId = post.get('ownerUserId');
        const ownerDisplayName = post.get('ownerDisplayName');
        const creationDate = post.get('creationDate');
        const ownerAvatar = post.get('ownerAvatar');
        const image = post.get('image');
        const body = post.get('body');
        const video = post.get('video');
        const thumbnail = post.get('thumbnail');
        const postTypeId = post.get('postTypeId');
        const id = post.get('id');
        const disableComments = post.get('disableComments');
        const commentCounter = post.get('commentCounter');
        const disableSharing = post.get('disableSharing');
        const score = post.get('score');
        const version = post.get('version');

        // Define variables
        return (
            <Card key={id + 'post-card'} className={classNames(classes.postBox, 'animate-top')}>
                <CardHeader
                    title={<DisplayName to={`/${ownerUserId}`}>{ownerDisplayName}</DisplayName>}
                    subheader={
                        creationDate ? (
                            (version === config.dataFormat.postVersion
                                ? moment(creationDate).local().fromNow()
                                : moment(creationDate).local().fromNow()) + ` | ${this.getPermissionLabel()}`
                        ) : (
                            <LinearProgress color="primary" />
                        )
                    }
                    avatar={
                        <DisplayName to={`/${ownerUserId}`}>
                            <UserAvatar fullName={ownerDisplayName} fileName={ownerAvatar} size={36} />
                        </DisplayName>
                    }
                    action={isPostOwner ? this.rightIconMenu() : ''}
                ></CardHeader>
                <CardContent className={classes.postBody}>
                    <ReadMoreComponent body={body}>
                        <Linkify
                            properties={{
                                target: '_blank',
                                style: { color: 'blue' },
                                onClick: (event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation(),
                            }}
                        >
                            {reactStringReplace(body, /#(\w+)/g, (match: string, i: number) => (
                                <Link
                                    style={{ color: 'green' }}
                                    key={match + i}
                                    to={`/tag/${match}`}
                                    onClick={(evt) => {
                                        evt.preventDefault();
                                        evt.stopPropagation();
                                        goTo(`/tag/${match}`);
                                        setHomeTitle(`#${match}`);
                                    }}
                                >
                                    #{match}
                                </Link>
                            ))}
                        </Linkify>
                    </ReadMoreComponent>
                </CardContent>
                {(image && image !== '' && postTypeId === PostType.Photo) ||
                (thumbnail && thumbnail !== '' && video && video !== '' && postTypeId === PostType.Video) ? (
                    <CardMedia className={classes.cardMedia} image={postTypeId === PostType.Photo ? image : thumbnail}>
                        {showVideo ? (
                            <div className="player-wrapper">
                                <ReactPlayer
                                    controls={true}
                                    className="react-player"
                                    width="100%"
                                    height="100%"
                                    url={video}
                                    playing
                                />
                            </div>
                        ) : (
                            <>
                                <Img fileName={postTypeId === PostType.Photo ? image : thumbnail} />
                                <span
                                    className={classNames(classes.playVideo, {
                                        [classes.noDisplay]: postTypeId !== PostType.Video,
                                    })}
                                >
                                    <IconButton className={classes.playIconButtonRoot} onClick={this.onShowVideo}>
                                        <SvgPlay sx={{ fontSize: '50px' }} />
                                    </IconButton>
                                </span>
                            </>
                        )}
                    </CardMedia>
                ) : (
                    ''
                )}
                {this.getAlbum()}

                <CardActions>
                    <div className={classes.vote}>
                        <IconButton className={classes.iconButton} onClick={this.handleVote} aria-label="Love">
                            <Checkbox
                                className={classes.iconButton}
                                checkedIcon={<LikeIcon style={{ fill: '#4CAF50' }} />}
                                icon={<SvgFavoriteBorder style={{ fill: '#757575' }} />}
                                checked={this.props.currentUserVote}
                            />
                        </IconButton>
                        <div className={classes.voteCounter}> {score > 0 ? score : ''} </div>
                    </div>

                    <div style={{ display: 'inherit' }}>
                        <IconButton
                            className={classes.iconButton}
                            onClick={this.handleOpenComments}
                            aria-label="Comment"
                        >
                            <CommentIcon />
                        </IconButton>
                        <div className={classes.commentCounter}>{commentCounter > 0 ? commentCounter : ''} </div>
                    </div>
                    {!disableSharing ? (
                        <IconButton className={classes.iconButton} onClick={this.handleOpenShare} aria-label="Comment">
                            <ShareIcon />
                        </IconButton>
                    ) : (
                        ''
                    )}
                </CardActions>

                <CommentGroup
                    open={this.state.openComments}
                    comments={commentList}
                    ownerPostUserId={ownerUserId}
                    onToggleRequest={this.handleOpenComments}
                    isPostOwner={this.props.isPostOwner}
                    disableComments={disableComments}
                    postId={id}
                />
                <ShareDialog
                    onClose={this.handleCloseShare}
                    shareOpen={this.state.shareOpen}
                    onCopyLink={this.handleCopyLink}
                    openCopyLink={this.state.openCopyLink}
                    post={post}
                />
            </Card>
        );
    }
}

export default connectPost(PostComponent);
