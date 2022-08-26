import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import red from '@mui/material/colors/red';
import IconButton from '@mui/material/IconButton';
import { createStyles, makeStyles } from '@mui/styles';

import Snackbar from '@mui/material/Snackbar';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import classNames from 'classnames';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { ICallSnackProps } from './ICallSnackProps';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            maxWidth: 400,
        },
        avatar: {
            width: 50,
            height: 50,
        },
        content: {
            maxHeight: 80,
            padding: 0,
        },
        listRoot: {
            paddingTop: 0,
        },
    }),
);

function CallSnackComponent(props: ICallSnackProps) {
    let audio: HTMLAudioElement;
    const { avatarURL, title, subtitle, userId, onClose, onConnect, soundURL } = props;
    const [init, setInit] = useState(false);

    useEffect(() => {
        // code to run on component mount
        if (!init) {
            try {
                const elementId = `audio${  new Date().valueOf().toString()}`;
                audio = document.createElement('audio');
                audio.setAttribute('id', elementId);
                audio.setAttribute('src', soundURL);
                document.body.appendChild(audio);
                audio.loop = true;
                audio.play();
            } catch (error: any) {}
            setInit(true);
        }
        return () => {
            audio.pause();
        };
    }, []);

    const classes = useStyles();
    const callBoxElement = () => (
        <List className={classes.listRoot}>
            <ListItem
                button
                onClick={() => {
                    onConnect(userId);
                }}
            >
                <ListItemAvatar>
                    <UserAvatar
                        className={classNames('calling', classes.avatar)}
                        displayName={title}
                        size={50}
                        src={avatarURL}
                    />
                </ListItemAvatar>
                <ListItemText primary={title} secondary={<span style={{ color: 'white' }}>{subtitle}</span>} />
                <ListItemSecondaryAction />
            </ListItem>
        </List>
    );

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open
            className={classes.root}
            ContentProps={{ classes: { message: classes.content } }}
            message={callBoxElement()}
            action={
                <IconButton
                    aria-label="comments"
                    onClick={() => {
                        onClose(userId);
                    }}
                >
                    <CallEndIcon style={{ color: red[500] }} />
                </IconButton>
            }
        />
    );
}

export default CallSnackComponent;
