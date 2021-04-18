// - Import react components
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import classNames from 'classnames';
import ChatComponent from 'components/chat/ChatComponent';
import React, { Component } from 'react';
import CookieConsent from 'react-cookie-consent';
import { WithTranslation } from 'react-i18next';
import IdleTimer from 'react-idle-timer';
import TelarTextLogo from 'layouts/telarTextLogo';
import { NavLink } from 'react-router-dom';
import { HomeRouter } from 'routes/HomeRouter';
import HomeHeader from 'components/homeHeader/HomeHeaderComponent';
import Typography from '@material-ui/core/Typography';

import { IHomeProps } from './IHomeProps';
import { IHomeState } from './IHomeState';
import { menuItems } from './menuItems';
import { log } from 'utils/log';
import { connectHome } from './connectHome';

export class HomeComponent extends Component<IHomeProps & WithTranslation, IHomeState> {
    idleTimer: any;
    /**
     * Portal Container
     */
    container: any = null;

    // Constructor
    constructor(props: IHomeProps & WithTranslation) {
        super(props);
        this.idleTimer = React.createRef();

        // Default state
        this.state = {
            drawerOpen: false,
        };

        // Binding function to `this`
        this.toggleChat = this.toggleChat.bind(this);
        this.onActive = this.onActive.bind(this);
        this.onIdle = this.onIdle.bind(this);
    }

    /**
     * Handle drawer toggle
     */
    handleDrawerToggle = () => {
        this.setState({ drawerOpen: !this.state.drawerOpen });
    };

    componentDidMount() {}

    /**
     * Toggle chat window to open/close
     */
    toggleChat() {
        const { isChatOpen, openChat, closeChat } = this.props;
        if (isChatOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    onActive() {
        log.info('time remaining', this.idleTimer.current.getRemainingTime());
    }

    onIdle() {
        log.info('last active', this.idleTimer.current.getLastActiveTime());
    }

    /**
     * Render DOM component
     */
    render() {
        const HR = HomeRouter;
        const { loaded, authed, t, classes, theme, activeRooms, currentUser } = this.props;
        const { drawerOpen } = this.state;
        if (!currentUser || !currentUser.get('userId')) {
            return <div />;
        }
        const drawer = (
            <div>
                {menuItems(currentUser.get('userId'), t).map((item: any, index) => {
                    if (item.path) {
                        return (
                            <NavLink key={`home-menu-${index}`} to={item.path}>
                                <MenuItem style={{ color: 'rgb(117, 117, 117)' }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText key={`home-menu-${index}`} primary={item.label} />
                                </MenuItem>
                            </NavLink>
                        );
                    } else if (item.onClick) {
                        return (
                            <MenuItem
                                key={`home-menu-${index}`}
                                onClick={item.onClick}
                                style={{ color: 'rgb(117, 117, 117)' }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </MenuItem>
                        );
                    } else {
                        return <Divider key={`home-menu-divider${index}`} />;
                    }
                })}
                <div className={classes.info}>
                    <Typography className={classes.pos} color="textSecondary">
                        What do you feel about Telar Social community version? Please share with us{' '}
                        <a href="https://github.com/Qolzam/feedback/issues/5" target="blank">
                            here
                        </a>
                        . Or join us on{' '}
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdkwt5pxmyCZQO0AmyAghBOdA-XBG298Pfm5Dw1xjNGaGeCYQ/viewform">
                            Slack
                        </a>
                        .
                        <br />
                        <br />
                        With <span className={classes.heartSymbol}>❤</span> by{' '}
                        <a href="https://telar.dev" target="blank">
                            Telar
                        </a>
                    </Typography>
                </div>
            </div>
        );

        const anchor = theme.direction === 'rtl' ? 'right' : 'left';
        const mainElement = (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <HomeHeader
                        onToggleDrawer={this.handleDrawerToggle}
                        onToggleMessenger={this.toggleChat}
                        drawerStatus={this.state.drawerOpen}
                    />
                    <Hidden mdUp>
                        <Drawer
                            variant="temporary"
                            open={this.state.drawerOpen}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            onClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <div>
                                <div className={classes.drawerHeader}>
                                    <TelarTextLogo viewBox="0 0 700 100" className={classes.logo} />
                                </div>
                                <MenuList style={{ color: 'rgb(117, 117, 117)', paddingTop: '0px' }}>
                                    <Divider />
                                    {drawer}
                                </MenuList>
                            </div>
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="js">
                        <Drawer
                            variant="persistent"
                            open={this.state.drawerOpen}
                            classes={{
                                paper: classes.drawerPaperLarge,
                            }}
                        >
                            <div>
                                <MenuList className={classes.menu} style={{ color: 'rgb(117, 117, 117)' }}>
                                    {drawer}
                                </MenuList>
                            </div>
                        </Drawer>
                    </Hidden>
                    <main
                        className={classNames(classes.content, classes[`content-${anchor}`], {
                            [classes.contentShift]: drawerOpen,
                            [classes[`contentShift-${anchor}`]]: drawerOpen,
                        })}
                    >
                        {loaded && authed ? <HR /> : ''}
                    </main>
                </div>

                {activeRooms
                    .map((room) => <ChatComponent key={room.get('objectId')} open={true} room={room} />)
                    .valueSeq()}
                <CookieConsent
                    location="bottom"
                    buttonText={t('home.cookieConsentButton')}
                    cookieName="social-consent"
                    style={{ background: '#2B373B', zIndex: 1200 }}
                    buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
                    expires={150}
                >
                    {t('home.cookieConsentText')}{' '}
                </CookieConsent>
            </div>
        );
        return (
            <IdleTimer
                ref={this.idleTimer}
                element={document}
                onActive={this.onActive}
                onIdle={this.onIdle}
                timeout={1000 * 6}
            >
                {mainElement}
            </IdleTimer>
        );
    }
}

export default connectHome(HomeComponent);
