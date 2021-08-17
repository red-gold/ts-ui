import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/core/Skeleton';
import { createStyles, makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React from 'react';

const useStyles = makeStyles((theme: any) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        paper: {
            height: 254,
            width: 243,
            margin: 10,
            textAlign: 'center',
            minWidth: 230,
            maxWidth: '257px',
        },
        dialogContent: {
            paddingTop: '5px',
            padding: '0px 5px 5px 5px',
        },
        circleName: {
            fontSize: '1rem',
        },
        space: {
            height: 20,
        },
        fullPageXs: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                height: '100%',
                margin: 0,
                overflowY: 'auto',
            },
        },
        followButton: {
            position: 'absolute',
            bottom: '30px',
            left: 0,
            right: 0,
        },
        dialog: {
            width: '',
            maxWidth: '280px',
            borderRadius: '4px',
        },
    }),
);

export function UserBoxSkeleton() {
    const classes = useStyles();

    return (
        <Paper elevation={1} className={classNames('grid-cell', classes.paper)}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    position: 'relative',
                    paddingTop: 20,
                }}
            >
                <div style={{ cursor: 'pointer' }}>
                    <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: '8px' }} />
                </div>
                <div className="people__name" style={{ cursor: 'pointer' }}>
                    <Skeleton variant="text" width={210} height={50} />
                </div>
                <div className="people__name" style={{ cursor: 'pointer' }}>
                    <Skeleton variant="text" width={100} height={50} />
                </div>
            </div>
        </Paper>
    );
}

export default UserBoxSkeleton;
