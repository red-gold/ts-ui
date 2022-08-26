import React from 'react';
import { List, Map } from 'immutable';
// material
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CommentIcon from '@mui/icons-material/CommentRounded';
import LikeIcon from '@mui/icons-material/FavoriteRounded';
import SvgFavoriteBorder from '@mui/icons-material/FavoriteBorderRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SvgPlay from '@mui/icons-material/PlayCircleFilled';
import ShareIcon from '@mui/icons-material/ShareRounded';
import { styled } from '@mui/material/styles';
import { Box, FormControlLabel, Stack } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
// utils
import { fShortenNumber } from 'utils/formatNumber';
//
import classNames from 'classnames';
import CommentGroup from 'components/commentGroup/CommentGroupComponent';
import Img from 'components/img';
import ReadMoreComponent from 'components/readMore';
import ShareDialog from 'components/shareDialog';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { PostType } from 'core/domain/posts/postType';
import PostAlbumComponent from 'oldComponents/postAlbum';
import moment from 'moment/moment';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player';
import { NavLink, useNavigate } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import config from 'config';

import { PATH_MAIN } from 'routes/paths';
import useLocales from 'hooks/useLocales';
import { dbFetchComments } from 'redux/actions/commentActions';
import { useDispatch, useSelector } from 'redux/store';
import { dbDeletePost, disableComment, disableSharing, setPostWriteModel } from 'redux/actions/postActions';
import useAuth from 'hooks/useAuth';
import { dbAddVote, dbDeleteVote } from 'redux/actions/voteActions';
import { openDialog, setHeaderTitle } from 'redux/actions/globalActions';
import { commentSelector } from 'redux/reducers/comments/commentSelector';
import { DialogType } from 'models/common/dialogType';

// ----------------------------------------------------------------------

const DisplayName = styled(NavLink)({
    color: '#212b36',
    textTransform: 'capitalize',
});

const Link = styled(NavLink)({});
// ----------------------------------------------------------------------

const selectComments = commentSelector.selectPostComments();

export interface PostComponentProps {
    post: Map<string, any>;
}

export default function PostCard({ post }: PostComponentProps) {
    const dispatch = useDispatch();
    const { t } = useLocales();
    const { user } = useAuth();
    const navigate = useNavigate();
    const classes = useStyles();

    // states
    const [isCommentDisabled, setIsCommentDisabled] = React.useState(post.get('disableComments'));
    const [isSharingDisabled, setIsSharingDisabled] = React.useState(post.get('disableSharing'));
    const [openComments, setOpenComments] = React.useState(false);
    const [shareOpen, setShareOpen] = React.useState(false);
    const [openCopyLink, setOpenCopyLink] = React.useState(false);
    const [postMenuAnchorEl, setPostMenuAnchorEl] = React.useState<any>(null);
    const [showVideo, setShowVideo] = React.useState(false);
    const [isLiked, setLiked] = React.useState(!!post.getIn(['votes', user?.id]));
    const isPostOwner = post.get('ownerUserId') === user?.id;

    // selectors
    const commentList = useSelector((state: Map<string, any>) => selectComments(state, { postId: post.get('id') }));

    /**
     * Toggle on show/hide comment
     */
    const handleOpenComments = () => {
        if (!openComments) {
            const id = post.get('id');
            dispatch<any>(dbFetchComments(id, 0, 10));
        }
        setOpenComments(!openComments);
    };

    /**
     * Delete a post
     */
    const handleDelete = () => {
        closePostMenu();
        dispatch<any>(dbDeletePost(post.get('id')));
    };

    /**
     * Handle edit a post
     */
    const handleEditPost = () => {
        dispatch<any>(setPostWriteModel(post));
        dispatch<any>(openDialog(DialogType.PostWrite));
    };

    /**
     * Open post menu
     */
    const openPostMenu = (event: any) => {
        setPostMenuAnchorEl(event.currentTarget);
    };

    /**
     * Close post menu
     */
    const closePostMenu = () => {
        setPostMenuAnchorEl(null);
    };

    /**
     * Show copy link
     */
    const handleCopyLink = () => {
        setOpenCopyLink(true);
    };

    /**
     * Open share post
     */
    const handleOpenShare = () => {
        setShareOpen(true);
    };

    /**
     * Close share post
     */
    const handleCloseShare = () => {
        setShareOpen(false);
        setOpenCopyLink(false);
    };

    /**
     * Handle vote on a post
     */
    const handleVote = () => {
        if (isLiked) {
            dispatch<any>(dbDeleteVote(post.get('id'), post.get('ownerUserId')));
            setLiked(false);
        } else {
            dispatch<any>(dbAddVote(post.get('id'), post.get('ownerUserId')));
            setLiked(true);
        }
    };

    /**
     * Handle on displaying video
     */
    const onShowVideo = () => {
        setShowVideo(true);
    };

    /**
     * Get permission label
     */
    const getPermissionLabel = () => {
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

    /**
     * Right Image Icon
     */
    const rightIconMenu = () => {
        return (
            <div>
                <IconButton onClick={openPostMenu}>
                    <MoreVertIcon />
                </IconButton>

                <Menu
                    open={!!postMenuAnchorEl}
                    anchorEl={postMenuAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={closePostMenu}
                >
                    {post.get('postTypeId') !== PostType.Album && (
                        <MenuItem onClick={handleEditPost}> {t('post.edit')} </MenuItem>
                    )}
                    <MenuItem onClick={handleDelete}> {t('post.delete')} </MenuItem>
                    <MenuItem
                        onClick={() => {
                            dispatch<any>(disableComment(id, !isCommentDisabled));
                            setIsCommentDisabled(!isCommentDisabled);
                        }}
                    >
                        {isCommentDisabled ? t('post.enableComments') : t('post.disableComments')}
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            dispatch<any>(disableSharing(id, !isSharingDisabled));
                            setIsSharingDisabled(!isSharingDisabled);
                        }}
                    >
                        {isSharingDisabled ? t('post.enableSharing') : t('post.disableSharing')}
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    const getAlbum = () => {
        const photos: List<string> = post.getIn(['album', 'photos'], List([])) as List<string>;
        return <PostAlbumComponent key={`post-album-grid-${id}`} currentAlbum={post} images={photos} />;
    };

    const ownerUserId = post.get('ownerUserId');
    const ownerDisplayName = post.get('ownerDisplayName');
    const creationDate = post.get('creationDate');
    const ownerAvatar = post.get('ownerAvatar');
    const body = post.get('body');
    const video = post.get('video');
    const id = post.get('id');
    const commentCounter = post.get('commentCounter');
    const score = post.get('score');
    const version = post.get('version');

    // Define variables
    return (
        <Card key={`${id  }post-card`} className={classNames(classes.postBox, 'animate-top')}>
            <CardHeader
                title={
                    <DisplayName to={PATH_MAIN.user.profile.replace(':socialName', post.get('socialName'))}>
                        {ownerDisplayName}
                    </DisplayName>
                }
                subheader={
                    creationDate ? (
                        `${version === config.dataFormat.postVersion
                            ? moment(creationDate).local().fromNow()
                            : moment(creationDate).local().fromNow()  } | ${getPermissionLabel()}`
                    ) : (
                        <LinearProgress color="primary" />
                    )
                }
                avatar={
                    <DisplayName to={PATH_MAIN.user.profile.replace(':socialName', post.get('socialName'))}>
                        <UserAvatar displayName={ownerDisplayName} src={ownerAvatar} size={36} />
                    </DisplayName>
                }
                action={isPostOwner ? rightIconMenu() : ''}
             />
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
                                    navigate(`/tag/${match}`);
                                    dispatch<any>(setHeaderTitle(`#${match}`));
                                }}
                            >
                                #{match}
                            </Link>
                        ))}
                    </Linkify>
                </ReadMoreComponent>
            </CardContent>
            {post.get('media') && (
                <CardMedia className={classes.cardMedia} image={post.get('media')}>
                    {showVideo ? (
                        <div className="player-wrapper">
                            <ReactPlayer
                                controls
                                className="react-player"
                                width="100%"
                                height="100%"
                                url={video}
                                playing
                            />
                        </div>
                    ) : (
                        <>
                            <Img fileName={post.get('media')} />

                            <span
                                className={classNames(classes.playVideo, {
                                    [classes.noDisplay]: post.get('video') === '',
                                })}
                            >
                                <IconButton className={classes.playIconButtonRoot} onClick={onShowVideo}>
                                    <SvgPlay sx={{ fontSize: '50px' }} />
                                </IconButton>
                            </span>
                        </>
                    )}
                </CardMedia>
            )}
            {(post.getIn(['album', 'photos'], List([])) as List<any>).size > 1 && getAlbum()}

            <Stack direction="row" alignItems="center" sx={{ padding: '10px 20px' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            color="success"
                            checked={isLiked}
                            icon={<SvgFavoriteBorder style={{ fill: '#757575' }} />}
                            checkedIcon={<LikeIcon style={{ fill: '#4CAF50' }} />}
                            onChange={handleVote}
                        />
                    }
                    label={fShortenNumber(score)}
                    sx={{ minWidth: 72, mr: 0 }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton className={classes.iconButton} onClick={handleOpenComments} aria-label="Comment">
                    <CommentIcon />
                </IconButton>
                <div className={classes.commentCounter}>{commentCounter > 0 ? commentCounter : ''} </div>

                {!isSharingDisabled ? (
                    <IconButton className={classes.iconButton} onClick={handleOpenShare} aria-label="Comment">
                        <ShareIcon />
                    </IconButton>
                ) : (
                    ''
                )}
            </Stack>

            <CommentGroup
                open={openComments}
                comments={commentList}
                ownerPostUserId={ownerUserId}
                onToggleRequest={handleOpenComments}
                isPostOwner={isPostOwner}
                disableComments={isCommentDisabled}
                postId={id}
            />
            <ShareDialog
                onClose={handleCloseShare}
                shareOpen={shareOpen}
                onCopyLink={handleCopyLink}
                openCopyLink={openCopyLink}
                post={post}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------

export const useStyles = makeStyles((theme: any) =>
    createStyles({
        iconButton: {
            // marginLeft: 5
        },
        vote: {
            display: 'flex',
            flex: 1,
        },
        postBox: {
            marginBottom: 24,
        },
        voteCounter: {
            color: '#777',
            fontSize: 12,
            fontWeight: 500,
            marginTop: 25,
            marginLeft: -18,
            marginRight: 6,
        },
        commentCounter: {
            fontWeight: 400,
            color: '#777',
            fontSize: 12,
            lineHeight: '48px',
            marginLeft: -2,
        },
        popperOpen: {
            zIndex: 10,
        },
        popperClose: {
            pointerEvents: 'none',
            zIndex: 0,
        },
        postBody: {
            wordWrap: 'break-word',
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '1rem',
            fontWeight: 400,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
        },
        image: {
            width: '100%',
            height: 500,
        },
        playVideo: {
            position: 'absolute',
            right: '45%',
            top: '45%',
            cursor: 'pointer',
            backgroundColor: '#f1efeca3',
            borderRadius: '50%',
            height: 60,
            padding: 0,
        },
        playIcon: {
            width: 60,
            height: 60,
            marginTop: '-12px',
            fill: 'red',
        },
        noDisplay: {
            display: 'none',
        },
        playIconButtonRoot: {
            width: 60,
            height: 60,
        },
        cardMedia: {
            position: 'relative',
        },
        fullPageXs: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                height: '100%',
                margin: 0,
                overflowY: 'auto',
            },
        },
    }),
);

// ----------------------------------------------------------------------
