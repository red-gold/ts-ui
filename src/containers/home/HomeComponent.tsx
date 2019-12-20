// - Import react components
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ChatComponent from 'components/chat/ChatComponent';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import React, { Component } from 'react';
import CookieConsent from 'react-cookie-consent';
import { withTranslation } from 'react-i18next';
import IdleTimer from 'react-idle-timer';
import { connect } from 'react-redux';
import TelarTextLogo from 'layouts/telarTextLogo';
import { NavLink, withRouter } from 'react-router-dom';
import { HomeRouter } from 'routes';
import HomeHeader from 'components/homeHeader/HomeHeaderComponent';
import config from 'config';
import * as chatActions from 'store/actions/chatActions';
import * as globalActions from 'store/actions/globalActions';

import { homeStyles } from './homeStyles';
import { IHomeComponentProps } from './IHomeComponentProps';
import { IHomeComponentState } from './IHomeComponentState';
import { menuItems } from './menuItems';

// - Import app components
// - Import API

// - Import Actions
// - Create Home component class
export class HomeComponent extends Component<IHomeComponentProps, IHomeComponentState> {

  idleTimer: any
  /**
   * Portal Container
   */
  container: any = null

  // Constructor
  constructor(props: IHomeComponentProps) {
    super(props)
    this.idleTimer = React.createRef()

    // Default state
    this.state = {
      drawerOpen: false
    }

    // Binding function to `this`
    this.toggleChat = this.toggleChat.bind(this)
    this.onActive = this.onActive.bind(this)
    this.onIdle = this.onIdle.bind(this)
  }

  /**
   * Handle drawer toggle
   */
  handleDrawerToggle = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen })
  }

  componentDidMount() {
  }

  /**
   * Toggle chat window to open/close
   */
  toggleChat() {
    const { isChatOpen, openChat, closeChat } = this.props
    if (isChatOpen) {
      closeChat!()
    } else {
      openChat!()
    }
  }

  onActive() {
    console.log('time remaining', this.idleTimer.current.getRemainingTime())
  }

  onIdle() {
    console.log('last active', this.idleTimer.current.getLastActiveTime())
  }

  /**
   * Render DOM component
   */
  render() {
    const HR = HomeRouter
    const { loaded, authed, showSendFeedback, t, classes, theme, isChatOpen } = this.props
    const { drawerOpen } = this.state

    const drawer = (
      <div>
        {
          menuItems(this.props.uid!, t!, showSendFeedback!).map((item: any, index) => {
            if (item.path) {
              return (<NavLink key={`home-menu-${index}`} to={item.path}>
                <MenuItem style={{color: 'rgb(117, 117, 117)'}}>
                  <ListItemIcon>
                    {item.icon!}
                  </ListItemIcon>
                  <ListItemText key={`home-menu-${index}`} primary={item.label} />
                </MenuItem>
              </NavLink>)
            } else if (item.onClick) {
              return (
                <MenuItem key={`home-menu-${index}`} onClick={item.onClick} style={{ color: 'rgb(117, 117, 117)' }}>
                  <ListItemIcon>
                    {item.icon!}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              )
            } else {
              return <Divider key={`home-menu-divider${index}`} />
            }

          })
        }
      </div>
    )

    const anchor = theme.direction === 'rtl' ? 'right' : 'left'
    const mainElement = (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <HomeHeader onToggleDrawer={this.handleDrawerToggle} drawerStatus={this.state.drawerOpen} />
          <Hidden mdUp>
            <Drawer
              variant='temporary'
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
                <div className={classes.drawerHeader} >
                  <TelarTextLogo viewBox='0 0 700 100' className={classes.logo}/>
                </div>
                <MenuList style={{ color: 'rgb(117, 117, 117)', width: '210px', paddingTop: '0px' }}>
                  <Divider />
                  {drawer}
                </MenuList>
              </div>
            </Drawer>
          </Hidden>
          <Hidden smDown implementation='js'>
            <Drawer
              variant='persistent'
              open={this.state.drawerOpen}
              classes={{
                paper: classes.drawerPaperLarge,
              }}
            >
              <div>
                <MenuList className={classes.menu} style={{ color: 'rgb(117, 117, 117)', width: '210px' }}>
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

        <ChatComponent open={isChatOpen!} onToggle={this.toggleChat} />
        <CookieConsent
          location='bottom'
          buttonText={t!('home.cookieConsentButton')}
          cookieName='social-consent'
          style={{ background: '#2B373B' }}
          buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
          expires={150}
        >
          {t!('home.cookieConsentText')}{' '}
        </CookieConsent>

      </div>
    )
    return (
      <IdleTimer
        ref={this.idleTimer}
        element={document}
        onActive={this.onActive}
        onIdle={this.onIdle}
        timeout={1000 * 6}>

        {mainElement}

      </IdleTimer>
    )
  }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any, ownProps: IHomeComponentProps) => {

  return {
    openChat: () => dispatch(chatActions.openChat()),
    closeChat: () => dispatch(chatActions.closeChat()),
    loadData: () => dispatch(globalActions.loadInitialData()),
    defaultDataDisable: () => {
      dispatch(globalActions.defaultDataDisable())
    },
    defaultDataEnable: () => {
      dispatch(globalActions.defaultDataEnable())
    },
    goTo: (url: string) => dispatch(push(url)),
    showSendFeedback: () => dispatch(globalActions.showSendFeedback()),
    hideSendFeedback: () => dispatch(globalActions.hideSendFeedback())
  }

}

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IHomeComponentProps) => {
  const isChatOpen = state.getIn(['chat', 'chatOpen'])
  const uid = state.getIn(['authorize', 'uid'], {})
  const global = state.get('global', {})

  return {
    isChatOpen,
    uid,
    authed: state.getIn(['authorize', 'authed'], false),
    global,
    loaded: state.getIn(['user', 'loaded']) && state.getIn(['imageGallery', 'loaded']) && state.getIn(['circle', 'loaded']) && state.getIn(['global', 'defaultLoadDataStatus'])
  }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(HomeComponent as any)

export default withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(withStyles(homeStyles as any, { withTheme: true })(translateWrapper as any) as any))
