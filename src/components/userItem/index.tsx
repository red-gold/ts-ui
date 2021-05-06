// - Import react components
import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { withStyles } from '@material-ui/core/styles';

import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { IUserItemProps } from './IUserItemProps';
import { IUserItemState } from './IUserItemState';
import ListItem from '@material-ui/core/ListItem';
import { userItemStyles } from './userItemStyles';
import Typography from '@material-ui/core/Typography';

export class UserItem extends Component<IUserItemProps & WithTranslation, IUserItemState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IUserItemProps & WithTranslation) {
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
     * Handle click on item
     */
    handleClick = () => {
        const { onClick, user } = this.props;
        if (onClick) {
            onClick(user);
        }
    };

    /**
     * Handle go to profile
     */
    goToProfile = () => {
        const { goTo, user, disableProfile } = this.props;
        if (disableProfile) {
            return;
        }
        const userId = user.get('userId');
        goTo(`/${userId}`);
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { user, follow, classes } = this.props;

        return (
            <ListItem onClick={this.handleClick}>
                <div className={classes.root}>
                    <span onClick={this.goToProfile} className={classes.avatar}>
                        <UserAvatar fullName={user.get('fullName')} fileName={user.get('avatar')} size={30} />
                    </span>
                    <Typography
                        className={classes.name}
                        onClick={this.goToProfile}
                        style={{ cursor: 'pointer' }}
                        variant="body1"
                    >
                        {user.get('fullName')}
                    </Typography>
                    {follow && <FollowDialogComponent user={user} />}
                </div>
            </ListItem>
        );
    }
}

const translateWrapper = withTranslation('translations')(UserItem);

export default withStyles(userItemStyles)(translateWrapper);
