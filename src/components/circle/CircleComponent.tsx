import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import SvgClose from '@material-ui/icons/Close';
import SvgGroup from '@material-ui/icons/GroupWork';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Circle } from 'core/domain/circles/circle';
import { Map } from 'immutable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import * as circleActions from 'redux/actions/circleActions';
import { circleSelector } from 'redux/reducers/circles/circleSelector';
import { PATH_MAIN } from 'routes/paths';
import { useStyles } from './circleStyles';
import { ICircleProps } from './ICircleProps';

const selectCircleUsers = circleSelector.selectCircleUsers();
const selectSettingOpen = circleSelector.selectSettingOpen();

export function CircleComponent(props: ICircleProps) {
    const { id, circle } = props;
    const classes = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const circleLabel = circle.get('name', '');

    const [circleName, setCircleName] = React.useState(
        circleLabel === 'Following' ? t('userBox.followingLabel') : circleLabel,
    );
    const [disabledSave, setDisabledSave] = React.useState(false);
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);

    // Dispatcher
    const dispatch = useDispatch();
    const deleteCircle = (id: string) => dispatch(circleActions.dbDeleteCircle(id));
    const updateCircle = (circle: Circle) => dispatch(circleActions.dbUpdateCircle(circle));
    const closeCircleSettings = () => dispatch(circleActions.closeCircleSettings(id));
    const openCircleSettings = () => dispatch(circleActions.openCircleSettings(id));

    // Selectors
    const circleUsers = useSelector((state: Map<string, any>) => selectCircleUsers(state, { circleId: id }));
    const settingOpen = useSelector((state: Map<string, any>) => selectSettingOpen(state, { circleId: id }));

    /**
     * Handle chage circle name
     *
     *
     * @memberof CircleComponent
     */
    const handleChangeCircleName = (evt: any) => {
        const { value } = evt.target;
        setCircleName(value === 'Following' ? t('userBox.followingLabel') : value);
        setDisabledSave(!value || value.trim() === '');
    };

    /**
     * Handle close menu
     */
    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    /**
     * Handle open menu
     */
    const handleOpenMenu = (event: any) => {
        setAnchorElMenu(event.currentTarget);
    };

    /**
     * Update user's circle
     *
     *
     * @memberof CircleComponent
     */
    const handleUpdateCircle = () => {
        if (circleName && circleName.trim() !== '') {
            updateCircle({ name: circleName, id: id });
        }
    };

    /**
     * Handle delete circle
     *
     *
     * @memberof CircleComponent
     */
    const handleDeleteCircle = () => {
        deleteCircle(id);
    };

    /**
     * Toggle circle to close/open
     *
     *
     * @memberof CircleComponent
     */
    const handleToggleCircle = () => {
        setOpen(!open);
    };

    const userList = () => {
        const usersParsed: any = [];

        if (circleUsers) {
            circleUsers.forEach((user: Map<string, any>, userId) => {
                const fullName = user.get('fullName');
                const avatar = user.get('avatar', '');
                usersParsed.push(
                    <ListItem
                        button
                        key={`${id}.${userId}`}
                        className={classes.userListItem}
                        onClick={() => navigate(PATH_MAIN.user.profile.replace(':socialName', user.get('socialName')))}
                    >
                        <UserAvatar displayName={fullName} src={avatar} />
                        <ListItemText inset primary={fullName} />
                    </ListItem>,
                );
            });
            return usersParsed;
        }
    };

    /**
     * Right icon menue of circle
     *
     */
    const rightIconMenu = (
        <div>
            <IconButton aria-owns={anchorElMenu ? 'circle-menu' : ''} aria-haspopup="true" onClick={handleOpenMenu}>
                <MoreVertIcon />
            </IconButton>

            <Popover
                id="current-user-menu-root"
                anchorEl={anchorElMenu}
                open={Boolean(anchorElMenu)}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        maxHeight: 200 * 4.5,
                        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.14)',
                    },
                }}
            >
                <MenuList role="menu">
                    <MenuItem onClick={handleDeleteCircle}> {t('circle.deleteCircleButton')} </MenuItem>
                    <MenuItem onClick={openCircleSettings}> {t('circle.settingLable')} </MenuItem>
                </MenuList>
            </Popover>
        </div>
    );

    const circleTitle = (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{ paddingRight: '10px' }}>
                    <SvgClose onClick={closeCircleSettings} style={{ cursor: 'pointer' }} />
                </div>
                <div
                    style={{
                        color: 'rgba(0,0,0,0.87)',
                        flex: '1 1',
                        font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
                    }}
                >
                    {t('circle.settingLable')}
                </div>
                <div style={{ marginTop: '-9px' }}>
                    <Button color="primary" disabled={disabledSave} onClick={handleUpdateCircle}>
                        {' '}
                        {t('circle.saveButton')}{' '}
                    </Button>
                </div>
            </div>
            <Divider />
        </div>
    );
    return (
        <div>
            <ListItem className={classes.root} key={id + '-CircleComponent'} onClick={handleToggleCircle}>
                <ListItemIcon>
                    <SvgGroup />
                </ListItemIcon>
                <ListItemText inset primary={<span>{circleName}</span>} />
                <ListItemSecondaryAction>{circle.get('isSystem') ? null : rightIconMenu}</ListItemSecondaryAction>
            </ListItem>
            <Collapse component="li" in={open} timeout="auto" unmountOnExit>
                <List disablePadding>{userList()}</List>
            </Collapse>
            <Dialog
                PaperProps={{ className: classes.fullPageXs }}
                key={id}
                open={settingOpen || false}
                onClose={closeCircleSettings}
                classes={{
                    paper: classes.dialogPaper,
                }}
            >
                <DialogTitle>{circleTitle}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        placeholder={t('circle.circleName')}
                        label={t('circle.circleName')}
                        onChange={handleChangeCircleName}
                        value={circleName}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CircleComponent;
