// - Import react components
import Paper from '@material-ui/core/Paper';
import { createStyles, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IUserBoxComponentProps } from './IUserBoxComponentProps';
import { IUserBoxComponentState } from './IUserBoxComponentState';

const styles = (theme: any) =>
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
    });

/**
 * Create component class
 */
export class UserBoxComponent extends Component<IUserBoxComponentProps & WithTranslation, IUserBoxComponentState> {
    styles = {
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
    };

    /**
     * Component constructor
     *
     */
    constructor(props: IUserBoxComponentProps & WithTranslation) {
        super(props);
        // Defaul state
        this.state = {
            /**
             * The value of circle input
             */
            circleName: ``,
            /**
             * It will be true if the text field for adding group is empty
             */
            disabledCreateCircle: true,
            /**
             * The button of add user in a circle is disabled {true} or not {false}
             */
            disabledAddToCircle: true,
            /**
             * Whether current user changed the selected circles for referer user
             */
            disabledDoneCircles: true,
        };
        // Binding functions to `this`
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { classes, user, goTo } = this.props;
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
                    <div onClick={() => goTo(`/${userId}`)} style={{ cursor: 'pointer' }}>
                        <UserAvatar fullName={user.get('fullName')} fileName={user.get('avatar')} size={90} />
                    </div>
                    <div onClick={() => goTo(`/${userId}`)} className="people__name" style={{ cursor: 'pointer' }}>
                        <div>{user.get('fullName')}</div>
                    </div>
                    <div style={this.styles.followButton as any}>
                        <FollowDialogComponent user={user} />
                    </div>
                </div>
            </Paper>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(UserBoxComponent);

export default withStyles(styles)(translateWrapper as any);
