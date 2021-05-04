import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { blue } from '@material-ui/core/colors';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import { isWidthDown } from '@material-ui/core/withWidth';
import BackIcon from '@material-ui/icons/ArrowBack';
import SvgDehaze from '@material-ui/icons/Dehaze';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import classNames from 'classnames';
import Notify from 'components/notify';
import SearchBoxComponent from 'components/searchBox';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import EditProfile from 'components/editProfile/EditProfileComponent';
import queryString from 'query-string';
import { WithTranslation } from 'react-i18next';

import { NavLink } from 'react-router-dom';
import TelarMonoLogo from 'layouts/telarMonoLogo';
import Badge from '@material-ui/core/Badge';
import { IHomeHeaderProps } from './IHomeHeaderProps';
import { IHomeHeaderState } from './IHomeHeaderState';
import { connectHomeHeader } from './connectHomeHeader';
import RoomListComponent from '../roomList';
import PostWrite from 'components/postWrite';

export class HomeHeaderComponent extends Component<IHomeHeaderProps & WithTranslation, IHomeHeaderState> {
    /**
     * Fields
     */
    unlisten: any;

    /**
     * Component constructor
     *
     */
    constructor(props: IHomeHeaderProps & WithTranslation) {
        super(props);

        // Default state
        this.state = {
            /**
             * User avatar popover is open if true
             */
            openAvatarMenu: false,
            /**
             * Show header title or not (true/false)
             */
            showTitle: true,
            /**
             * If true notification menu will be open
             */
            openNotifyMenu: false,
            /**
             * If true notification menu will be open
             */
            openRecentChatMenu: false,
            /**
             * Search text
             */
            searchText: '',
            /**
             * Whether current page is search page
             */
            isSearchPage: false,
            /**
             * The location of previous page before redirecting to the
             */
            previousLocation: '/',
        };

        // Binding functions to `this`
        this.onToggleSidebar = this.onToggleSidebar.bind(this);
        this.handleCloseNotify = this.handleCloseNotify.bind(this);
        this.checkPageLocation = this.checkPageLocation.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    /**
     * Handle close notification menu
     */
    handleCloseNotify = () => {
        this.setState({
            anchorElNotify: null,
            openNotifyMenu: false,
        });
    };

    /**
     * Handle close room list
     */
    handleCloseRoomList = () => {
        this.setState({
            anchorElRoomList: null,
        });
    };

    /**
     * Handle close avatar menu
     */
    handleCloseAvatarMenu = () => {
        this.setState({
            anchorElAvatar: null,
            openAvatarMenu: false,
        });
    };

    // On click toggle sidebar
    onToggleSidebar = () => {
        const { onToggleDrawer } = this.props;
        onToggleDrawer();
    };

    /**
     * Handle notification touch
     */
    handleNotifyTouchTap = (event: any) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openNotifyMenu: true,
            anchorElNotify: event.currentTarget,
        });
    };

    /**
     * Handle room list touch
     */
    handlRoomListTouchTap = (event: any) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            anchorElRoomList: event.currentTarget,
        });
    };

    /**
     * Handle notification touch
     */
    handleAvatarTouchTap = (event: any) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openAvatarMenu: true,
            anchorElAvatar: event.currentTarget,
        });
    };

    /**
     * Handle search on change
     */
    handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value });
    };

    /**
     * Handle logout user
     */
    handleLogout = () => {
        if (this.props.logout) {
            this.props.logout();
        }
    };

    /**
     * Handle resize event for window to manipulate home header status
     */
    handleResize = () => {
        const { drawerStatus } = this.props;
        // Set initial state
        const width = window.innerWidth;

        if (width >= 600 && !drawerStatus) {
            this.onToggleSidebar();
        } else if (width < 600) {
        }
    };

    /**
     * Handle search
     */
    handleSearch() {
        const { goTo } = this.props;
        if (goTo) {
            goTo('/search?q=');
        }
    }

    /**
     * Check page location
     */
    checkPageLocation(nextLocation: any) {
        const { location } = this.props;
        const nextParams: { q: string } = queryString.parse(nextLocation.search) as any;
        const params: { q: string } = queryString.parse(location.search) as any;
        const isPreviousSearch = params !== undefined && params.q !== undefined;
        const nextState = {
            isSearchPage: nextParams !== undefined && nextParams.q !== undefined,
        };
        if (!isPreviousSearch) {
            nextState['previousLocation'] = location.pathname;
        }
        this.setState(nextState);
    }
    /**
     * Handle mouse down prevent default
     */
    handleMouseDown = (event: any) => {
        event.preventDefault();
    };

    componentDidMount() {
        const { history } = this.props;
        this.unlisten = history.listen((location: any) => {
            this.checkPageLocation(location);
        });
        this.handleResize();
    }

    componentWillUnmount() {
        this.unlisten();
    }

    // Render app DOM component
    render() {
        const { classes, t, theme, myProfileAccountOpen, unreadRoomsCount, postWriteOpen } = this.props;
        const { isSearchPage, previousLocation } = this.state;
        const anchor = theme.direction === 'rtl' ? 'right' : 'left';

        const rightHeader = (
            <div className="homeHeader__right">
                <Hidden smUp>
                    <IconButton
                        onClick={this.handleSearch}
                        onMouseDown={this.handleMouseDown}
                        className={classes.searchButton}
                    >
                        <SearchIcon style={{ color: theme.palette.common.white }} />
                    </IconButton>
                </Hidden>

                {/* Messenger */}
                <Tooltip title={t('header.messengerTooltip')}>
                    <IconButton
                        onClick={this.handlRoomListTouchTap}
                        onMouseDown={this.handleMouseDown}
                        className={classes.messengerButton}
                    >
                        <Badge badgeContent={unreadRoomsCount} color="error">
                            <ChatIcon style={{ color: theme.palette.common.white }} />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <RoomListComponent
                    open={!!this.state.anchorElRoomList}
                    anchorEl={this.state.anchorElRoomList}
                    onClose={this.handleCloseRoomList}
                />

                {/* Notification */}

                <Tooltip title={t('header.notificationTooltip')}>
                    <IconButton onClick={this.handleNotifyTouchTap}>
                        <Badge badgeContent={this.props.notifyCount} color="error">
                            <NotificationsIcon style={{ color: theme.palette.common.white }} />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Notify
                    open={this.state.openNotifyMenu}
                    anchorEl={this.state.anchorElNotify}
                    onClose={this.handleCloseNotify}
                />

                {/* User avatar*/}
                <UserAvatarComponent
                    onClick={this.handleAvatarTouchTap}
                    fullName={this.props.fullName}
                    fileName={this.props.avatar}
                    size={32}
                    className={classes.avatar}
                />

                <Menu
                    open={this.state.openAvatarMenu}
                    anchorEl={this.state.anchorElAvatar}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={this.handleCloseAvatarMenu}
                >
                    <MenuItem
                        style={{ backgroundColor: 'white', color: blue[500], fontSize: '14px' }}
                        onClick={this.props.openEditor}
                    >
                        {' '}
                        {t('header.myAccount')}{' '}
                    </MenuItem>
                    <MenuItem style={{ fontSize: '14px' }} onClick={this.handleLogout.bind(this)}>
                        {' '}
                        {t('header.logout')}{' '}
                    </MenuItem>
                </Menu>
                {myProfileAccountOpen ? (
                    <EditProfile
                        avatar={this.props.avatar ? this.props.avatar : ''}
                        banner={this.props.banner ? this.props.banner : ''}
                        fullName={this.props.fullName ? this.props.fullName : ''}
                    />
                ) : (
                    ''
                )}
            </div>
        );

        return (
            <AppBar position="fixed">
                <Toolbar>
                    {/* Left side */}
                    {!isSearchPage ? (
                        <IconButton onClick={this.onToggleSidebar}>
                            <SvgDehaze style={{ cursor: 'pointer', color: theme.palette.common.white }} />
                        </IconButton>
                    ) : (
                        <NavLink to={previousLocation}>
                            <IconButton>
                                <BackIcon style={{ cursor: 'pointer', color: theme.palette.common.white }} />
                            </IconButton>
                        </NavLink>
                    )}

                    {/* Header title */}
                    {isWidthDown('xs', this.props.width) && isSearchPage ? (
                        ''
                    ) : (
                        <TelarMonoLogo viewBox="10 0 30 65" className={classes.appIcon} />
                    )}

                    <div className="homeHeader__title-root">
                        <Hidden smDown>
                            <div
                                className={classNames(classes.pageTitle, {
                                    'homeHeader__title-left': anchor === 'left',
                                    'homeHeader__title-right': anchor === 'right',
                                })}
                            >
                                {this.props.title}
                            </div>
                        </Hidden>
                    </div>
                    <div className={classes.fullBox}>
                        <Hidden xsDown>
                            <div className={classes.searchBox}>
                                <SearchBoxComponent />
                            </div>
                        </Hidden>

                        {isWidthDown('xs', this.props.width) && isSearchPage ? (
                            <div className={classes.smallSearchBox}>
                                <SearchBoxComponent />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                    {isWidthDown('xs', this.props.width) && isSearchPage ? '' : rightHeader}
                </Toolbar>
                {postWriteOpen && <PostWrite />}
            </AppBar>
        );
    }
}

export default connectHomeHeader(HomeHeaderComponent);
