import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import classNames from 'classnames';
import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { useIdleTimer } from 'react-idle-timer';
import HomeHeader from 'components/HomeHeader';
import Typography from '@mui/material/Typography';
import { log } from 'utils/log';
import { addNotifyAudio } from 'utils/audio';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Map, List } from 'immutable';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import useTheme from '@mui/material/styles/useTheme';
import { Theme } from '@mui/material/styles/createTheme';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import NavItem from 'components/navItem';
import TelarSocialLogo from 'oldComponents/telarSocialLogo';
import { useStyles } from './homeStyles';
import { menuItems } from './menuItems';
// selectors
const selectCurrentUser = authorizeSelector.selectCurrentUser();
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

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));

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
                } if (item.onClick) {
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
                } 
                    return <Divider key={`home-menu-divider${index}`} />;
                
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
