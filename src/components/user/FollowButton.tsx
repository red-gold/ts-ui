import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AppDialogTitle from 'oldComponents/dialogTitle/DialogTitleComponent';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import SvgAdd from '@material-ui/icons/Add';
import StringAPI from 'api/StringAPI';
import { followDialogStyles } from 'components/followDialog/followDialogStyles';
import { ServerRequestType } from 'constants/serverRequestType';
import { UserTie } from 'core/domain/circles/userTie';
import { List as ImuList, Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { userGetters } from 'redux/reducers/users/userGetters';
import * as circleActions from 'redux/actions/circleActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

import { IFollowDialogProps } from '../followDialog/IFollowDialogProps';
import { IFollowDialogState } from '../followDialog/IFollowDialogState';
import MobileDialog from 'components/mobileDialog';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

export class FollowButton extends Component<IFollowDialogProps & WithTranslation, IFollowDialogState> {
    constructor(props: IFollowDialogProps & WithTranslation) {
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
        this.handleChangeName = this.handleChangeName.bind(this);
        this.onCreateCircle = this.onCreateCircle.bind(this);
        this.handleDoneAddCircle = this.handleDoneAddCircle.bind(this);
        this.circleList = this.circleList.bind(this);
    }

    /**
     * Handle follow user
     */
    handleDoneAddCircle = () => {
        const { user, addUserToCircle, selectedCircles, deleteFollowingUser, avatar, fullName } = this.props;
        const userId = user.get('userId');
        const { disabledDoneCircles } = this.state;
        if (!disabledDoneCircles && selectedCircles && addUserToCircle && deleteFollowingUser) {
            if (selectedCircles.count() > 0) {
                addUserToCircle(selectedCircles, { avatar, userId, fullName });
            } else {
                deleteFollowingUser(userId);
            }
        }
    };

    /**
     * Handle follow user
     */
    onFollowUser = (event: any) => {
        // This prevents ghost click
        event.preventDefault();
        const { isFollowed, followUser, followingCircle, user, followRequest, avatar, fullName } = this.props;
        const userId = user.get('userId');

        if (!followUser || !followingCircle) {
            return;
        }
        if (followRequest && followRequest.status === ServerRequestStatusType.Sent) {
            return;
        } else if (isFollowed) {
            this.onRequestOpenAddCircle();
        } else if (followingCircle) {
            followUser(followingCircle.get('id'), { avatar, userId, fullName });
        } else {
            followUser(userId, { avatar, userId, fullName });
        }
    };

    /**
     * Handle request close for add circle box
     */
    onRequestCloseAddCircle = () => {
        const { setSelectedCircles, user, userBelongCircles, closeSelectCircles } = this.props;
        const userId = user.get('userId');

        if (!setSelectedCircles || !userBelongCircles || !closeSelectCircles) {
            return;
        }
        setSelectedCircles(userId, userBelongCircles);
        closeSelectCircles(userId);
        this.setState({
            circleName: ``,
            disabledCreateCircle: true,
            disabledAddToCircle: true,
            disabledDoneCircles: true,
        });
    };

    /**
     * Handle request open for add circle box
     */
    onRequestOpenAddCircle = () => {
        const { openSelectCircles, user, followingCircle } = this.props;
        const userId = user.get('userId');

        if (followingCircle && openSelectCircles) {
            openSelectCircles(userId);
        }
    };

    /**
     * Create a new circle
     */
    onCreateCircle = () => {
        const { circleName } = this.state;
        const { createCircle } = this.props;
        if (createCircle && circleName && circleName.trim() !== '') {
            createCircle(this.state.circleName);
            this.setState({
                circleName: '',
                disabledCreateCircle: true,
            });
        }
    };

    /**
     * Handle change group name input to the state
     */
    handleChangeName = (event: any) => {
        this.setState({
            circleName: event.target.value,
            disabledCreateCircle: event.target.value === undefined || event.target.value.trim() === '',
        });
    };

    handleSelectCircle = (event: React.ChangeEvent<HTMLInputElement>, circleId: string) => {
        const { setSelectedCircles, selectedCircles, user } = this.props;
        const userId = user.get('userId');

        if (!selectedCircles || !setSelectedCircles) {
            return;
        }
        let newSelectedCircles = selectedCircles;
        if (event.target.checked) {
            newSelectedCircles = selectedCircles.push(circleId);
        } else {
            const circleIndex = selectedCircles.indexOf(circleId);
            newSelectedCircles = newSelectedCircles.remove(circleIndex);
        }

        setSelectedCircles(userId, newSelectedCircles);
        this.setState({
            disabledDoneCircles: !this.selectedCircleChange(newSelectedCircles),
        });
    };

    /**
     * Create a circle list of user which belong to
     */
    circleList = () => {
        const { circles, user, selectedCircles, classes, t } = this.props;
        const userId = user.get('userId');

        const circleDomList: any[] = [];
        if (circles) {
            circles.forEach((circle, circleId) => {
                const isBelong = selectedCircles ? selectedCircles.indexOf(circleId) > -1 : false;
                const circleName = circle.get('name');
                // Create checkbox for selected/unselected circle
                circleDomList.push(
                    <ListItem key={`${circleId}-${userId}`} dense className={classes.listItem}>
                        <ListItemIcon>
                            <Checkbox
                                onChange={(event) => this.handleSelectCircle(event, circleId)}
                                checked={isBelong}
                            />
                        </ListItemIcon>
                        <Typography variant="subtitle1" className={classes.title} color="textPrimary" gutterBottom>
                            {circleName === 'Following' ? t('userBox.followingLabel') : circleName}
                        </Typography>
                    </ListItem>,
                );
            });

            return circleDomList;
        }
    };

    /**
     * Check if the the selected circles changed
     */
    selectedCircleChange = (selectedCircles: ImuList<string>) => {
        let isChanged = false;
        const { userBelongCircles } = this.props;
        if (!userBelongCircles || !selectedCircles) {
            return;
        }
        if (selectedCircles.count() === userBelongCircles.count()) {
            for (let circleIndex = 0; circleIndex < selectedCircles.count(); circleIndex++) {
                const selectedCircleId = selectedCircles.get(circleIndex, '');
                if (!(userBelongCircles.indexOf(selectedCircleId) > -1)) {
                    isChanged = true;
                    break;
                }
            }
        } else {
            isChanged = true;
        }
        return isChanged;
    };

    render() {
        const { disabledDoneCircles } = this.state;
        const {
            isFollowed,
            firstBelongCircle,
            belongCirclesCount,
            followRequest,
            user,
            isSelecteCirclesOpen,
            addToCircleRequest,
            deleteFollowingUserRequest,
            classes,
            t,
        } = this.props;
        const userId = user.get('userId');

        if (!t) {
            return <div />;
        }
        const followButtonLable = !isFollowed
            ? t('userBox.followButton')
            : (belongCirclesCount || 0) > 1
            ? t('userBox.numberOfCircleButton', { circlesCount: belongCirclesCount })
            : firstBelongCircle
            ? firstBelongCircle.get('name', t('userBox.followedLabel'))
            : t('userBox.followButton');
        return (
            <>
                <Button
                    color={this.props.color || 'primary'}
                    onClick={this.onFollowUser}
                    disabled={
                        (followRequest ? followRequest.status === ServerRequestStatusType.Sent : false) ||
                        (deleteFollowingUserRequest
                            ? deleteFollowingUserRequest.status === ServerRequestStatusType.Sent
                            : false)
                    }
                    variant={this.props.variant}
                >
                    {followButtonLable === 'Following' ? t('userBox.followingLabel') : followButtonLable}
                </Button>

                <MobileDialog
                    fullWidth
                    key={userId}
                    open={isSelecteCirclesOpen === true}
                    onClose={this.onRequestCloseAddCircle}
                >
                    <AppDialogTitle
                        title={t('userBox.manageGroupsTitle')}
                        onRequestClose={this.onRequestCloseAddCircle}
                    />
                    <DialogContent className={classes.dialogContent}>
                        <List>
                            {this.circleList()}
                            <div className={classes.space}></div>
                            <Divider />
                            <ListItem key={`'circleName'-${userId}`}>
                                <TextField
                                    autoFocus
                                    placeholder={t('userBox.groupNamePlaceholder')}
                                    onChange={this.handleChangeName}
                                    value={this.state.circleName}
                                    fullWidth
                                    sx={{ padding: '11.5px ​14p' }}
                                />
                                <IconButton onClick={this.onCreateCircle} disabled={this.state.disabledCreateCircle}>
                                    <Tooltip title={t('userBox.createCircleTooltip')}>
                                        <SvgAdd />
                                    </Tooltip>
                                </IconButton>
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            disableFocusRipple={true}
                            disableRipple={true}
                            disabled={
                                disabledDoneCircles ||
                                (addToCircleRequest
                                    ? addToCircleRequest.status === ServerRequestStatusType.Sent
                                    : false)
                            }
                            onClick={this.handleDoneAddCircle}
                        >
                            {t('userBox.doneButton')}
                        </Button>
                    </DialogActions>
                </MobileDialog>
            </>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: Function) => {
    return {
        createCircle: (name: string) => dispatch(circleActions.dbAddCircle(name)),
        addUserToCircle: (circleIds: ImuList<string>, user: UserTie) =>
            dispatch(circleActions.dbUpdateUserInCircles(circleIds, user)),
        followUser: (circleId: string, userFollowing: UserTie) =>
            dispatch(circleActions.dbFollowUser(circleId, userFollowing)),
        deleteFollowingUser: (followingId: string) => dispatch(circleActions.dbDeleteFollowingUser(followingId)),
        setSelectedCircles: (userId: string, circleList: string[]) =>
            dispatch(circleActions.setSelectedCircles(userId, circleList)),
        removeSelectedCircles: (userId: string) => dispatch(circleActions.removeSelectedCircles(userId)),
        openSelectCircles: (userId: string) => dispatch(circleActions.openSelectCircleBox(userId)),
        closeSelectCircles: (userId: string) => dispatch(circleActions.closeSelectCircleBox(userId)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IFollowDialogProps) => {
    const userId = ownProps.user.get('userId');

    const circles: Map<string, Map<string, any>> = state.getIn(['circle', 'circleList'], Map({}));
    const userBelongCircles: ImuList<any> = state.getIn(['circle', 'userTies', userId, 'circleIdList'], ImuList());
    const isFollowed = userBelongCircles.count() > 0;

    const followingCircle = circles
        .filter((filterCircle) => filterCircle.get('isSystem', false) && filterCircle.get('name') === `Following`)
        .first(Map({}));
    const followRequestId = StringAPI.createServerRequestId(ServerRequestType.CircleFollowUser, userId);
    const followRequest = state.getIn(['server', 'request', followRequestId]);
    const selectedCircles = state.getIn(['circle', 'selectedCircles', userId], []);

    const isSelecteCirclesOpen = state.getIn(['circle', 'ui', 'openSelecteCircles', userId], []);
    const userBox = userGetters.getUserProfileById(state, { userId: userId });
    return {
        isSelecteCirclesOpen,
        isFollowed,
        selectedCircles,
        circles,
        followingCircle,
        userBelongCircles,
        followRequest,
        belongCirclesCount: userBelongCircles.count() || 0,
        firstBelongCircle: userBelongCircles ? circles.get(userBelongCircles.get(0), Map({})) : Map({}),
        avatar: userBox.get('avatar', ''),
        fullName: userBox.get('fullName', ''),
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(FollowButton);

export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(followDialogStyles as any)(translateWrapper as any));
