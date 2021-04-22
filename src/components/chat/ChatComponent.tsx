// - Import react components
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import BackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import EmojiIcon from '@material-ui/icons/SentimentSatisfied';
import classNames from 'classnames';
import ChatBodyComponent from 'components/chatBody/ChatBodyComponent';
import ChatRoomSettingComponent from 'components/chatRoomSetting/ChatRoomSettingComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { Message } from 'core/domain/chat/message';
import { MessageType } from 'core/domain/chat/MessageType';
import { Picker } from 'emoji-mart';
import debounce from 'lodash/debounce';
import moment from 'moment/moment';
import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import { WithTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { IChatProps } from './IChatProps';
import { IChatState } from './IChatState';
import { ChatRoom } from 'core/domain/chat/chatRoom';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { connectChat } from './connectChat';
import { Map } from 'immutable';

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
            emojiOpen: false,
            leftSideDisabled: false,
            rightSideDisabled: false,
            smallSize: false,
            isMinimized: false,
            lastReadMessage: Map({}),
            isScrollEnd: true,
        };

        this.handleResize = debounce(this.handleResize, 200);

        // Binding functions to `this`
        this.sendMessage = this.sendMessage.bind(this);
        this.setCurrentChat = this.setCurrentChat.bind(this);
        this.handleRemoveHistory = this.handleRemoveHistory.bind(this);
        this.closeRoom = this.closeRoom.bind(this);
        this.handleToggleEmoji = this.handleToggleEmoji.bind(this);
        this.handleOpenEmojiMenu = this.handleOpenEmojiMenu.bind(this);
        this.handleCloseEmojiMenu = this.handleCloseEmojiMenu.bind(this);
        this.handleToggleSetting = this.handleToggleSetting.bind(this);
        this.handleReadMessage = this.handleReadMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /**
     * Send message
     */
    sendMessage() {
        const { messageText } = this.state;
        const { sendMessage, room } = this.props;
        const roomId = room.get('objectId');
        if (!messageText || (messageText && messageText.trim() === '')) {
            return;
        }
        this.handleCloseEmojiMenu();
        sendMessage(new Message(uuidv4(), roomId, messageText, MessageType.Text));

        const chatBodyElm = document.querySelector('#chat-body-scroll');
        if (chatBodyElm) {
            chatBodyElm.scrollTop = chatBodyElm.scrollHeight;
        }

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

    handleClickInput = () => {
        this.handleCloseEmojiMenu();
    };

    /**
     * Handle close current user menu
     */
    handleCloseCurrentUserMenu = () => {
        this.setState({ anchorElCurrentUser: null });
    };

    /**
     * Handle toggle emoji
     */
    handleToggleEmoji = () => {
        if (this.state.emojiOpen) {
            this.handleCloseEmojiMenu();
        } else {
            this.handleOpenEmojiMenu();
        }
    };

    /**
     * Handle open emoji menu
     */
    handleOpenEmojiMenu = () => {
        this.setState({ emojiOpen: true });
    };

    /**
     * Handle close emoji menu
     */
    handleCloseEmojiMenu = () => {
        this.setState({ emojiOpen: false });
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
        // this.setState((prevState) => {
        //     return { isMinimized: !prevState.isMinimized, anchorElCurrentUser: null };
        // });
    };

    /**
     * Handle contact menu
     */
    handleContactMenu = () => {};

    /**
     * Handle remove history
     */
    handleRemoveHistory() {}

    /**
     * Set current chat
     */
    setCurrentChat(recieverId: string) {}

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
     * Close room
     */
    closeRoom() {
        const { closeRoom, room } = this.props;
        const roomId = room.get('objectId');
        closeRoom(roomId);
    }

    componentDidMount() {
        this.handleResize();
    }

    /**
     * Get user status
     * @param user Target user
     * @returns user status
     */
    getUserStatus(user: Map<string, any>) {
        const { t } = this.props;
        const lastSeen = user.get('lastSeen', 0);

        // Last seen is not a code
        if (lastSeen > 5) {
            return moment(lastSeen).local().fromNow();
        } else if (lastSeen === 1) {
            return t('userStatus.online');
        } else {
            return t('userStatus.neverSeen');
        }
    }

    handleReadMessage(message: Map<string, any>) {
        const { lastReadMessage } = this.state;
        const { updateReadMessageMeta, room } = this.props;

        const newCreatedDate = message.get('createdDate');
        const newLastCreatedDate = lastReadMessage.get('createdDate', 0);
        if (!lastReadMessage.equals(message) && newCreatedDate > newLastCreatedDate) {
            const roomId = room.get('objectId');
            const messageCount = room.get('messageCount');
            updateReadMessageMeta(roomId, message.get('objectId'), messageCount, newCreatedDate);
            this.setState({ lastReadMessage: message });
        }
    }

    /**
     * Whether user is online or not
     * @param user Target user status
     * @returns User online status `true|false`
     */
    isUserOnline(user: Map<string, any>) {
        const lastSeen = user.get('lastSeen', 0);
        if (lastSeen === 1) {
            return true;
        }
        return false;
    }

    handleKeyPress(e: any) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    /**
     * Reneder component DOM
     */
    render() {
        const {
            t,
            classes,
            open,
            messages,
            receiverUser,
            currentUser,
            room,
            oldQueryMessageStatus,
            oldQueryMessageRequestId,
            newQueryMessageStatus,
            newQueryMessageRequestId,
            hasMoreOldMessages,
            hasMoreNewMessages,
            queryMessage,
        } = this.props;
        const roomId = room.get('objectId');
        const {
            smallSize,
            anchorElCurrentUser,
            emojiOpen,
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
                <MenuItem className={classes.menuItem} key={'current-user-menu-root-close'} onClick={this.closeRoom}>
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
            <Card className={classNames(classes.leftSideChatRoot, { [classes.noDisplay]: leftSideClose })}>
                <ListItem classes={{ container: classes.currentUserItem }} className={classNames(classes.userItem)}>
                    <UserAvatar fullName={currentUser.get('fullName')} size={30} fileName={currentUser.get('avatar')} />
                    <ListItemText
                        className={classes.listItemText}
                        classes={{ primary: classes.primaryText, secondary: classes.secondaryText }}
                        primary={currentUser.get('fullName')}
                        secondary={currentUser.get('tagLine')}
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
            </Card>
        );

        const userItem = (
            <ListItem className={classNames(classes.userItem, classes.receiverUserItem)}>
                <IconButton className={classes.header}>
                    <BackIcon />
                </IconButton>
                <div className={classes.avatarRoot}>
                    <ListItemAvatar>
                        <UserAvatar
                            fullName={receiverUser.get('fullName')}
                            size={40}
                            fileName={receiverUser.get('avatar')}
                        />
                    </ListItemAvatar>
                    <span
                        className={classNames(classes.statusIcon, { online: this.isUserOnline(receiverUser) })}
                    ></span>
                </div>
                <ListItemText
                    onClick={this.toggleMinimize}
                    primary={receiverUser.get('fullName')}
                    secondary={this.getUserStatus(receiverUser)}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={this.closeRoom}>
                        <CloseIcon className={classes.receiverMoreIcon} />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );

        /**
         * Right chat side
         */
        const rightSide = (
            <Card className={classNames(classes.rightSideChatRoot, { [classes.noDisplay]: rightSideDisabled })}>
                <List className={classes.listContainer}>
                    {userItem}
                    <Divider />
                    {currentUserMenu}

                    <div className={classNames({ [classes.noDisplay]: !emojiOpen }, classes.pickerRoot)}>
                        <Picker
                            native
                            emojiSize={22}
                            onSelect={this.handleSelectEmoji}
                            showPreview={false}
                            custom={[]}
                        />
                    </div>
                    <ChatBodyComponent
                        queryMessage={queryMessage}
                        oldQueryMessageRequestId={oldQueryMessageRequestId}
                        oldQueryMessageStatus={oldQueryMessageStatus}
                        newQueryMessageRequestId={newQueryMessageRequestId}
                        newQueryMessageStatus={newQueryMessageStatus}
                        receiverUser={receiverUser}
                        currentUser={currentUser}
                        chatMessages={messages}
                        handleReadMessage={this.handleReadMessage}
                        room={room}
                        hasMoreOldMessages={hasMoreOldMessages}
                        hasMoreNewMessages={hasMoreNewMessages}
                    />

                    <Divider />

                    <div className={classNames(classes.sendMessageRoot, { [classes.noDisplay]: isMinimized })}>
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
                                onKeyDown={this.handleKeyPress}
                                onChange={this.handleChange('messageText')}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <EmojiIcon className={classes.emojiIcon} onClick={this.handleToggleEmoji} />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Divider orientation="vertical" />
                        <IconButton onClick={this.sendMessage} onMouseDown={this.handleMouseDown}>
                            <SendIcon className={classes.sendIcon} />
                        </IconButton>
                    </div>
                </List>
            </Card>
        );
        return (
            <Card
                className={classNames(
                    classes.fullPageXs,
                    classes.root,
                    { [classes.rootMinimized]: isMinimized },
                    { [classes.noDisplay]: !open },
                )}
            >
                <EventListener target="window" onResize={this.handleResize} />

                {/* {leftSide} */}
                {settingDisplyed ? (
                    <ChatRoomSettingComponent
                        open={settingDisplyed}
                        onClose={this.handleToggleSetting}
                        rightSideDisabled={rightSideDisabled}
                        leftSideClose={leftSideClose}
                        room={{ id: roomId } as ChatRoom}
                        currentUser={currentUser}
                    />
                ) : (
                    rightSide
                )}
            </Card>
        );
    }
}
export default connectChat(ChatComponent);
