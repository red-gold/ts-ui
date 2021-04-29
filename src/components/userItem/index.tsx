// - Import react components
import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { withStyles } from '@material-ui/core/styles';

import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { IUserItemProps } from './IUserItemProps';
import { IUserItemState } from './IUserItemState';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { userItemStyles } from './userItemStyles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
/**
 * Create component class
 */
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
        const { user, follow } = this.props;

        return (
            <ListItem onClick={this.handleClick}>
                <ListItemAvatar>
                    <span onClick={this.goToProfile} style={{ cursor: 'pointer' }}>
                        <UserAvatar fullName={user.get('fullName')} fileName={user.get('avatar')} size={30} />
                    </span>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <span onClick={this.goToProfile} style={{ cursor: 'pointer' }}>
                            {user.get('fullName')}
                        </span>
                    }
                />
                {follow && (
                    <ListItemSecondaryAction>
                        <FollowDialogComponent user={user} />
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        );
    }
}

const translateWrapper = withTranslation('translations')(UserItem);

export default withStyles(userItemStyles)(translateWrapper);
