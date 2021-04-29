// - Import react components
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { IDialogTitleComponentProps } from './IDialogTitleComponentProps';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles';

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

/**
 * Create component class
 */
export default function DialogTitleComponent(props: IDialogTitleComponentProps) {
    const { onRequestClose, title } = props;
    const classes = useStyles();
    return (
        <AppBar color={'transparent'} className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onRequestClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                {props.children && props.children}
            </Toolbar>
        </AppBar>
    );
}
