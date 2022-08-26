import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { IDialogTitleComponentProps } from './IDialogTitleComponentProps';

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
