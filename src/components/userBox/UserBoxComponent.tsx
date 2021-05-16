import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React from 'react';
import { useNavigate } from 'react-router';
import { IUserBoxComponentProps } from './IUserBoxComponentProps';

const useStyles = makeStyles((theme: any) => ({
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
}));

export function UserBoxComponent(props: IUserBoxComponentProps) {
    const classes = useStyles();
    const navigate = useNavigate();

    const { user } = props;
    const userId = user.get('userId');

    return (
        <Paper key={userId} elevation={1} className={classNames('grid-cell', classes.paper)}>
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
                <div onClick={() => navigate(`/${userId}`)} style={{ cursor: 'pointer' }}>
                    <UserAvatar fullName={user.get('fullName')} fileName={user.get('avatar')} size={90} />
                </div>
                <div onClick={() => navigate(`/${userId}`)} className="people__name" style={{ cursor: 'pointer' }}>
                    <div>{user.get('fullName')}</div>
                </div>
                <div className={classes.followButton}>
                    <FollowDialogComponent user={user} />
                </div>
            </div>
        </Paper>
    );
}

export default UserBoxComponent;
