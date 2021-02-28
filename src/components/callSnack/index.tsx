import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import red from '@material-ui/core/colors/red';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import classNames from 'classnames';
import CallEndIcon from '@material-ui/icons/CallEnd';
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
                const elementId = 'audio' + new Date().valueOf().toString();
                audio = document.createElement('audio');
                audio.setAttribute('id', elementId);
                audio.setAttribute('src', soundURL);
                document.body.appendChild(audio);
                audio.loop = true;
                audio.play();
            } catch (error) {}
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
                        fullName={title}
                        size={50}
                        fileName={avatarURL}
                    />
                </ListItemAvatar>
                <ListItemText primary={title} secondary={<span style={{ color: 'white' }}>{subtitle}</span>} />
                <ListItemSecondaryAction></ListItemSecondaryAction>
            </ListItem>
        </List>
    );

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={true}
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
