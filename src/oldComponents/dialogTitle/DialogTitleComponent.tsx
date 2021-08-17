import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { IDialogTitleComponentProps } from './IDialogTitleComponentProps';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);

export default function DialogTitleComponent(props: IDialogTitleComponentProps) {
    const { onRequestClose, title } = props;
    const classes = useStyles();
    return (
        <>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onRequestClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                {props.children && props.children}
            </Toolbar>
            <Divider />
        </>
    );
}
