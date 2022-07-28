import React from 'react';
import copy from 'copy-to-clipboard';
// material
import { Dialog, ListItemIcon, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import SvgLink from '@mui/icons-material/Link';
//
import classNames from 'classnames';
import { List, Map } from 'immutable';
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton,
} from 'react-share';

import useLocales from 'hooks/useLocales';

const useStyles = makeStyles((theme: any) =>
    createStyles({
        image: {
            verticalAlign: 'top',
            maxWidth: '100%',
            minWidth: '100%',
            width: '100%',
        },
        clipboard: {
            minWidth: '300px',
            fontSize: '13px',
            textAlign: 'center',
            marginTop: '10px',
            color: '#1e882d',
            fontWeight: 400,
        },
        fbIcon: { marginRight: '10px' },
        twitterIcon: { marginRight: '-7px' },
        inIcon: { marginRight: '6px' },
        copyIcon: {
            marginRight: '6px',
            marginLeft: '6px',
        },
        shareButton: {
            width: '100%',
        },
        fullPageXs: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                height: '100%',
                margin: 0,
                overflowY: 'auto',
            },
        },
        shareLinkPaper: {
            minHeight: 80,
            padding: 10,
            minWidth: 460,
        },
    }),
);

export interface ShareDialogComponentProps {
    shareOpen: boolean;
    onClose: () => void;
    openCopyLink: boolean;
    onCopyLink: () => void;
    post: Map<string, any>;
}

export default function ShareDialogComponent({
    shareOpen,
    onClose,
    openCopyLink,
    post,
    onCopyLink,
}: ShareDialogComponentProps) {
    const { t } = useLocales();
    const classes = useStyles();

    const shareLink = `${window.location.origin}/posts/${post.get('urlKey')}`;

    const handleCopyLink = () => {
        copy(shareLink);
        onCopyLink();
    };

    return (
        <Dialog className={classes.fullPageXs} title="Share On" open={shareOpen} onClose={onClose}>
            {!openCopyLink ? (
                <Stack spacing={1} sx={{ p: 3 }}>
                    <FacebookShareButton
                        onShareWindowClose={onClose}
                        url={`${window.location.origin}/${post.get('ownerUserId')}/posts/${post.get('id')}`}
                        quote={post.get('body')}
                        hashtag={
                            post.get('tags', List<string>([])).count() > 0
                                ? `#${post.getIn(['tags', 0], 'hashtag')}`
                                : undefined
                        }
                        className={classes.shareButton}
                    >
                        <MenuItem>
                            <ListItemIcon classes={{ root: classes.fbIcon }}>
                                <FacebookIcon size={32} round />
                            </ListItemIcon>
                            <ListItemText primary={t('post.facebookButton')} />
                        </MenuItem>
                    </FacebookShareButton>

                    <TwitterShareButton
                        onShareWindowClose={onClose}
                        url={`${window.location.origin}/${post.get('ownerUserId')}/posts/${post.get('id')}`}
                        title={post.get('body')}
                        hashtags={[...post.get('tags', [])]}
                        className={classes.shareButton}
                    >
                        <MenuItem>
                            <ListItemIcon classes={{ root: classes.twitterIcon }}>
                                <TwitterIcon size={32} round />
                            </ListItemIcon>
                            <ListItemText primary={t('post.twitterButton')} />
                        </MenuItem>
                    </TwitterShareButton>

                    <LinkedinShareButton
                        onShareWindowClose={onClose}
                        url={`${window.location.origin}/${post.get('ownerUserId')}/posts/${post.get('id')}`}
                        title={post.get('body')}
                        className={classes.shareButton}
                    >
                        <MenuItem>
                            <ListItemIcon classes={{ root: classes.inIcon }}>
                                <LinkedinIcon size={32} round />
                            </ListItemIcon>
                            <ListItemText primary={t('post.linkedinButton')} />
                        </MenuItem>
                    </LinkedinShareButton>

                    <MenuItem onClick={handleCopyLink}>
                        <ListItemIcon classes={{ root: classes.copyIcon }}>
                            <SvgLink />
                        </ListItemIcon>
                        <ListItemText primary={t('post.copyLinkButton')} />
                    </MenuItem>
                </Stack>
            ) : (
                <div>
                    <TextField autoFocus fullWidth id="text-field-default" defaultValue={shareLink} />
                    <Typography className={classNames('animate-top', classes.clipboard)} variant="h5" component="h2">
                        Link has been copied to clipboard ...
                    </Typography>
                </div>
            )}
        </Dialog>
    );
}
