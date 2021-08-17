import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import classNames from 'classnames';
import ChatComponent from 'components/chat/ChatComponent';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { useIdleTimer } from 'react-idle-timer';
import HomeHeader from 'components/HomeHeader';
import Typography from '@material-ui/core/Typography';
import { chatSelector } from 'redux/reducers/chat/chatSelector';
import * as chatActions from 'redux/actions/chatActions';
import { menuItems } from './menuItems';
import { log } from 'utils/log';
import { addNotifyAudio } from 'utils/audio';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Map, List } from 'immutable';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { useStyles } from './homeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import { Theme } from '@material-ui/core/styles/createTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import NavItem from 'components/navItem';
import TelarSocialLogo from 'oldComponents/telarSocialLogo';
// selectors
const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectChatOpen = chatSelector.selectChatOpen();
const selectActiveRooms = chatSelector.selectActiveRooms();
// ----------------------------------------------------------------------

export interface HomeProps {
    children?: React.ReactNode;
}

export function HomeComponent({ children }: HomeProps) {
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const mdUpHidden = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const smDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Dispatcher
    const dispatch = useDispatch();
    const openChat = () => dispatch(chatActions.openRoom(''));
    const closeChat = () => dispatch(chatActions.closeChat());

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const isChatOpen: boolean = useSelector((state: Map<string, any>) => selectChatOpen(state));
    const activeRooms = useSelector((state: Map<string, any>) => selectActiveRooms(state)) as List<Map<string, any>>;

    /**
     * Handle drawer toggle
     */
    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    React.useEffect(() => {
        window.addEventListener(
            'click',
            () => {
                addNotifyAudio();
            },
            { once: true },
        );
    }, []);

    /**
     * Toggle chat window to open/close
     */
    const toggleChat = () => {
        if (isChatOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    const handleOnIdle = () => {
        log.info('last active', getLastActiveTime());
    };

    const handleOnActive = () => {
        log.info('time remaining', getRemainingTime());
    };

    const handleOnAction = () => {
        log.info('user did something!');
    };

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 15,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500,
    });

    const drawer = (
        <div>
            {menuItems(currentUser.get('socialName'), t).map((item: any, index) => {
                if (item.path) {
                    return (
                        <NavItem key={`home-nav-item-${index}`} icon={item.icon} href={item.path} title={item.label} />
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
                <Typography color="textSecondary">
                    What do you think about Telar Social? Please share with us{' '}
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
    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <HomeHeader
                    onToggleDrawer={handleDrawerToggle}
                    onToggleMessenger={toggleChat}
                    drawerStatus={drawerOpen}
                />
                {!mdUpHidden && (
                    <Drawer
                        variant="temporary"
                        open={drawerOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <TelarSocialLogo
                                sx={{ width: 40, height: 44, fill: theme.palette.primary.light }}
                                viewBox="0 0 600 646"
                            />
                        </div>
                        <MenuList style={{ color: 'rgb(117, 117, 117)', padding: '16px' }}>{drawer}</MenuList>
                    </Drawer>
                )}
                {!smDownHidden && (
                    <Drawer
                        variant="persistent"
                        open={drawerOpen}
                        classes={{
                            paper: classes.drawerPaperLarge,
                        }}
                    >
                        <MenuList className={classes.menu} style={{ color: 'rgb(117, 117, 117)', padding: '16px' }}>
                            <div style={{ height: 70 }} />
                            {drawer}
                        </MenuList>
                    </Drawer>
                )}
                <main
                    className={classNames(classes.content, classes[`content-${anchor}`], {
                        [classes.contentShift]: drawerOpen,
                        [classes[`contentShift-${anchor}`]]: drawerOpen,
                    })}
                >
                    {children}
                </main>
            </div>

            {activeRooms.map((room) => <ChatComponent key={room.get('objectId')} open={true} room={room} />).valueSeq()}
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
}

export default HomeComponent;
