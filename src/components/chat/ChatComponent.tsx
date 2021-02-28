// - Import react components
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import BackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import EmojiIcon from '@material-ui/icons/SentimentSatisfied';
import classNames from 'classnames';
import ChatBodyComponent from 'components/chatBody/ChatBodyComponent';
import ChatRoomSettingComponent from 'components/chatRoomSetting/ChatRoomSettingComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Message } from 'core/domain/chat/message';
import { MessageType } from 'core/domain/chat/MessageType';
import { Picker } from 'emoji-mart';
import { Map } from 'immutable';
import debounce from 'lodash/debounce';
import moment from 'moment/moment';
import * as Ramda from 'ramda';
import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as chatActions from 'store/actions/chatActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { chatSelector } from 'store/reducers/chat/chatSelector';
import uuid from 'uuid';

import { chatStyles } from './chatStyles';
import { IChatProps } from './IChatProps';
import { IChatState } from './IChatState';
import { userSelector } from 'store/reducers/users/userSelector';
import { ChatRoom } from 'core/domain/chat/chatRoom';
import { throwNoValue } from 'utils/errorHandling';
import { SocialError } from 'core/domain/common/socialError';

/**
 * Create component class
 */
export class ChatComponent extends Component<IChatProps & WithTranslation, IChatState> {
    /**
     * Component constructor
     */
    constructor(props: IChatProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            newMessageCount: 0,
            searchText: '',
            settingDisplyed: false,
            messageText: '',
            anchorElCurrentUser: null,
            anchorElEmoji: null,
            leftSideDisabled: false,
            rightSideDisabled: false,
            smallSize: false,
            isMinimized: false,
        };

        this.handleResize = debounce(this.handleResize, 200);

        // Binding functions to `this`
        this.sendMessage = this.sendMessage.bind(this);
        this.setCurrentChat = this.setCurrentChat.bind(this);
        this.handleRemoveHistory = this.handleRemoveHistory.bind(this);
        this.closeChatBox = this.closeChatBox.bind(this);
        this.handleToggleSetting = this.handleToggleSetting.bind(this);
    }

    /**
     * Send message
     */
    sendMessage() {
        const { messageText } = this.state;
        const currentDate = moment.utc().valueOf();
        const { currentUser, receiverUser, sendMessage, currentChatRoom } = this.props;
        if (!currentUser || !receiverUser || !sendMessage || !currentChatRoom) {
            throw new SocialError('nullValueSendMessage', 'There is a null value in props ');
        }
        let translation: string | undefined = undefined;
        const receiverUserData = throwNoValue(receiverUser, 'receiverUser');
        const receiveLang = Ramda.path(
            ['translation', receiverUserData.get('userId'), 'input'],
            currentChatRoom,
        ) as string;
        const sendLang = Ramda.path(
            ['translation', currentUser.userId || (currentUser as any).id, 'output'],
            currentChatRoom,
        ) as string;
        if (receiveLang) {
            translation = receiveLang;
        } else if (sendLang) {
            translation = sendLang;
        }

        sendMessage(
            new Message(
                uuid(),
                {
                    [receiverUser.get('userId')]: true,
                    [currentUser.userId || (currentUser as any).id]: true,
                },
                currentDate,
                messageText,
                currentChatRoom,
                receiverUser.get('userId'),
                currentUser.userId || (currentUser as any).id,
                MessageType.Text,
                translation,
            ),
        );
        this.setState({
            messageText: '',
        });
    }

    /**
     * Handle search
     */
    handleSearch() {}

    /**
     * Handle display setting
     */
    handleToggleSetting = () => {
        this.setState((prevState) => {
            return { settingDisplyed: !prevState.settingDisplyed, anchorElCurrentUser: null };
        });
    };

    /**
     * Handle search on change
     */
    handleChange = (prop: any) => (event: any) => {
        this.setState({ [prop]: event.target.value });
    };

    /**
     * Handle mouse down prevent default
     */
    handleMouseDown = (event: any) => {
        event.preventDefault();
    };

    /**
     * Handle open current user menu
     */
    handleOpenCurrentUserMenu = (event: any) => {
        this.setState({ anchorElCurrentUser: event.currentTarget });
    };

    /**
     * Handle close current user menu
     */
    handleCloseCurrentUserMenu = () => {
        this.setState({ anchorElCurrentUser: null });
    };

    /**
     * Handle open emoji menu
     */
    handleOpenEmojiMenu = (event: any) => {
        this.setState({ anchorElEmoji: event.currentTarget });
    };

    /**
     * Handle close emoji menu
     */
    handleCloseEmojiMenu = () => {
        this.setState({ anchorElEmoji: null });
    };

    /**
     * Handle select emoji
     */
    handleSelectEmoji = (emoji: any) => {
        this.setState((prevState) => {
            const { messageText } = prevState;
            return { messageText: messageText + emoji.native };
        });
    };

    /**
     * Toggle left side
     */
    toggleLeftSide = () => {
        this.setState((prevState) => {
            return { leftSideDisabled: !prevState.leftSideDisabled };
        });
    };

    /**
     * Toggle right side
     */
    toggleRightSide = () => {
        this.setState((prevState) => {
            return { rightSideDisabled: !prevState.rightSideDisabled };
        });
    };

    /**
     * Handle resize event on window
     */
    handleResize = () => {
        const width = window.innerWidth;
        if (width < 599.95) {
            this.setState({
                smallSize: true,
            });
        } else {
            this.setState({
                smallSize: false,
            });
        }
    };

    /**
     * Handle toggle minimize
     */
    toggleMinimize = () => {
        this.setState((prevState) => {
            return { isMinimized: !prevState.isMinimized, anchorElCurrentUser: null };
        });
    };

    /**
     * Handle contact menu
     */
    handleContactMenu = () => {
        const { openRecentChat, width } = this.props;
        if (openRecentChat && width && isWidthDown('xs', width)) {
            openRecentChat();
        } else {
            this.toggleLeftSide();
        }
        this.setState({
            anchorElCurrentUser: null,
        });
    };

    /**
     * Handle remove history
     */
    handleRemoveHistory() {
        const { removeChatHistory, currentChatRoom } = this.props;
        if (removeChatHistory && currentChatRoom) {
            removeChatHistory(currentChatRoom);
            this.setState({ anchorElCurrentUser: null });
        }
    }

    /**
     * Handle key press
     */
    handleKeyPress() {}

    /**
     * Set current chat
     */
    setCurrentChat(recieverId: string) {
        const { setCurrentChat } = this.props;
        if (setCurrentChat) {
            setCurrentChat(recieverId);
        }
    }

    /**
     * Contact list
     */
    contactList = () => {
        const { connections, classes, receiverUser, users } = this.props;
        const parsedDOM: any[] = [];
        if (connections && users && receiverUser) {
            connections.forEach((value, key) => {
                const user = users.get(key);
                const userId = user.get('userId');
                parsedDOM.push(
                    <ListItem
                        onClick={() => this.setCurrentChat(userId)}
                        key={`chat-component-contact-user-${userId}`}
                        button
                        className={classNames({ [classes.activeUserItem]: receiverUser.get('userId') === userId })}
                    >
                        <UserAvatar fullName={user.get('fullName', '')} size={30} fileName={user.get('avatar', '')} />
                        <ListItemText
                            className={classes.listItemText}
                            classes={{ primary: classes.primaryText, secondary: classes.secondaryText }}
                            primary={user.get('fullName', '')}
                            secondary={''}
                        />
                    </ListItem>,
                );
            });
        }
        return parsedDOM;
    };

    /**
     * Close chat box
     */
    closeChatBox() {
        const { onToggle } = this.props;
        this.setState({
            anchorElCurrentUser: null,
        });
        if (onToggle) {
            onToggle();
        }
    }

    componentDidMount() {
        this.handleResize();
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { t, classes, open, onToggle, chatMessages, receiverUser, currentUser, currentChatRoom } = this.props;
        const {
            smallSize,
            anchorElCurrentUser,
            anchorElEmoji,
            isMinimized,
            messageText,
            leftSideDisabled,
            rightSideDisabled,
            settingDisplyed,
        } = this.state;

        if (!t || !currentUser || !receiverUser) {
            return <div />;
        }

        /**
         * Current user menu
         */
        const currentUserMenu = (
            <Popover
                id="current-user-menu-root"
                anchorEl={anchorElCurrentUser}
                open={Boolean(anchorElCurrentUser)}
                onClose={this.handleCloseCurrentUserMenu}
                PaperProps={{
                    style: {
                        maxHeight: 200 * 4.5,
                        width: 100,
                        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.14)',
                    },
                }}
            >
                <MenuItem
                    className={classes.menuItem}
                    key={'current-user-menu-root-contact'}
                    onClick={this.handleContactMenu}
                >
                    {t('chat.contactsCaption')}
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    key={'current-user-menu-root-remove-history'}
                    onClick={this.handleRemoveHistory}
                >
                    {t('chat.removeHistoryCaption')}
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    key={'current-user-menu-root-minimize'}
                    onClick={this.toggleMinimize}
                >
                    {!isMinimized ? t('chat.minimizeMenu') : t('chat.maximumMenu')}
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    key={'current-user-menu-root-setting'}
                    onClick={this.handleToggleSetting}
                >
                    {t('chat.settingCaption')}
                </MenuItem>
                <MenuItem className={classes.menuItem} key={'current-user-menu-root-close'} onClick={this.closeChatBox}>
                    {t('chat.closeMenu')}
                </MenuItem>
            </Popover>
        );

        /**
         * Whether left side is close
         */
        const leftSideClose = leftSideDisabled || smallSize || isMinimized;

        /**
         * Left chat side
         */
        const leftSide = (
            <Grid
                item
                sm={6}
                md={6}
                lg={6}
                xl={6}
                className={classNames(classes.leftSideChatRoot, { [classes.noDisplay]: leftSideClose })}
            >
                <ListItem classes={{ container: classes.currentUserItem }} className={classNames(classes.userItem)}>
                    <UserAvatar fullName={currentUser.fullName} size={30} fileName={currentUser.avatar} />
                    <ListItemText
                        className={classes.listItemText}
                        classes={{ primary: classes.primaryText, secondary: classes.secondaryText }}
                        primary={currentUser.fullName}
                        secondary={currentUser.tagLine}
                    />
                    <ListItemSecondaryAction>
                        <IconButton className={classes.moreMenu} onClick={this.toggleLeftSide}>
                            <MenuIcon className={classes.moreMenuIcon} />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {/* <FormControl fullWidth component='div' className={classes.searchField}>
            <Input
              className={classes.searchInput}
              id='adornment-search'
              placeholder={t('chat.searchText')}
              type={'text'}
              disableUnderline
              fullWidth
              value={searchText}
              onChange={this.handleChange('searchText')}
              startAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={this.handleSearch}
                    onMouseDown={this.handleMouseDown}
                  >
                    <SearchIcon className={classes.searchIcon} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl> */}
                <List className={classNames(classes.listContainer, classes.leftListContainer)}>
                    {this.contactList()}
                </List>
            </Grid>
        );

        /**
         * Left chat side
         */
        const rightSide = (
            <Grid
                item
                xs={12}
                sm={leftSideClose ? 12 : 6}
                md={leftSideClose ? 12 : 6}
                lg={leftSideClose ? 12 : 6}
                xl={leftSideClose ? 12 : 6}
                className={classNames(classes.rightSideChatRoot, { [classes.noDisplay]: rightSideDisabled })}
            >
                <List className={classes.listContainer}>
                    <ListItem className={classNames(classes.userItem, classes.receiverUserItem)}>
                        <IconButton className={classes.header} onClick={onToggle}>
                            <BackIcon />
                        </IconButton>
                        <UserAvatar
                            fullName={receiverUser.get('fullName')}
                            size={30}
                            fileName={receiverUser.get('avatar')}
                        />
                        <ListItemText
                            onClick={this.toggleMinimize}
                            className={classNames(classes.receiverUserRoot, classes.listItemText)}
                            classes={{
                                primary: classes.primaryText,
                                secondary: classNames(classes.secondaryText, classes.receiverSecondaryText),
                            }}
                            primary={receiverUser.get('fullName')}
                            secondary={receiverUser.get('tagLine', '')}
                        />
                        <ListItemSecondaryAction>
                            <IconButton onClick={this.handleOpenCurrentUserMenu}>
                                <MoreIcon className={classes.receiverMoreIcon} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {currentUserMenu}
                    <ChatBodyComponent currentUser={currentUser} chatMessages={chatMessages} />

                    <li className={classNames(classes.sendMessageRoot, { [classes.noDisplay]: isMinimized })}>
                        <FormControl fullWidth className={classes.messageField}>
                            <Input
                                className={classes.messageInput}
                                id="adornment-password"
                                placeholder={t('chat.messageText')}
                                type={'text'}
                                disableUnderline
                                fullWidth
                                value={messageText}
                                multiline
                                rows={1}
                                rowsMax={4}
                                onChange={this.handleChange('messageText')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <EmojiIcon className={classes.emojiIcon} onClick={this.handleOpenEmojiMenu} />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <IconButton onClick={this.sendMessage} onMouseDown={this.handleMouseDown}>
                            <SendIcon className={classes.sendIcon} />
                        </IconButton>
                    </li>
                </List>
            </Grid>
        );
        return (
            <Grid
                className={classNames(
                    classes.fullPageXs,
                    classes.root,
                    { [classes.oneColumn]: leftSideClose || rightSideDisabled },
                    { [classes.rootMinimized]: isMinimized },
                    { [classes.noDisplay]: !open },
                )}
                container
                spacing={2}
            >
                <EventListener target="window" onResize={this.handleResize} />

                <Popover
                    open={Boolean(anchorElEmoji)}
                    anchorEl={anchorElEmoji}
                    onClose={this.handleCloseEmojiMenu}
                    PaperProps={{ className: classNames(classes.fullPageEmojiXs, classes.paperEmoji) }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Picker emojiSize={20} onClick={this.handleSelectEmoji} showPreview={false} custom={[]} />
                </Popover>

                {leftSide}
                {settingDisplyed ? (
                    <ChatRoomSettingComponent
                        open={settingDisplyed}
                        onClose={this.handleToggleSetting}
                        rightSideDisabled={rightSideDisabled}
                        leftSideClose={leftSideClose}
                        room={{ id: currentChatRoom } as ChatRoom}
                        currentUser={currentUser}
                    />
                ) : (
                    rightSide
                )}
            </Grid>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        sendMessage: (message: Message) => dispatch(chatActions.dbCreateChatMessage(message)),
        openRecentChat: () => dispatch(chatActions.openRecentChat()),
        closeRecentChat: () => dispatch(chatActions.closeRecentChat()),
        removeChatHistory: (roomId: string) => dispatch(chatActions.dbRemoveChatHistory(roomId)),
        setCurrentChat: (roomId: string) => dispatch(chatActions.setCurrentChat(roomId)),
    };
};

const makeMapStateToProps = () => {
    const selectUsers = userSelector.selectUsers();
    const selectCurrentReceiver = chatSelector.selectCurrentReceiver();
    const selectCurrentChatRoom = chatSelector.selectCurrentChatRoom();
    const selectCurrentMessages = chatSelector.selectCurrentMessages();
    const selectChatConnections = chatSelector.selectChatConnections();
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const mapStateToProps = (state: Map<string, any>) => {
        const receiverUser = selectCurrentReceiver(state);
        const connections = selectChatConnections(state);
        const users = selectUsers(state);
        return {
            receiverUser,
            chatMessages: selectCurrentMessages(state, { userId: receiverUser.get('userId') }).toJS(),
            currentUser: selectCurrentUser(state).toJS(),
            currentChatRoom: selectCurrentChatRoom(state),
            recentChatOpen: state.getIn(['chat', 'recentChatOpen'], false),
            connections,
            users,
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(ChatComponent);

export default connect<{}, {}, IChatProps, any>(
    makeMapStateToProps,
    mapDispatchToProps,
)(withWidth({ resizeInterval: 200 })(withStyles(chatStyles)(translateWrapper)));
