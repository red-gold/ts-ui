export const chatMessageStyles = (theme: any) => ({
    root: {
        display: 'flex',
        marginBottom: 24,
    },
    rootMinimized: {
        height: '44px',
    },
    oneColumn: {
        width: '300px',
    },
    primaryText: {
        fontSize: '12px !important',
        color: 'rgba(255, 255, 255, 0.87) !important',
        fontWeight: 300,
    },
    secondaryText: {
        color: '#c1b7f59e',
        fontSize: 10,
        fontWeight: 300,
    },
    receiverSecondaryText: {
        color: '#989898c9',
    },
    moreMenu: {
        color: 'rgb(255, 255, 255)',
    },
    moreMenuIcon: {
        fontSize: 20,
    },
    receiverMoreIcon: {
        fontSize: 20,
        color: '#989898c9',
    },
    userItem: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 4,
    },
    receiverUserItem: {
        backgroundColor: theme.palette.primary.main,
    },
    searchInput: {
        fontSize: '10px !important',
        color: 'rgb(200, 188, 255) !important',
    },
    searchField: {
        margin: '13px 0px',
    },
    searchIcon: {
        fontSize: 15,
        color: 'white',
    },
    sendIcon: {
        color: '#989898',
    },
    emojiIcon: {
        fontSize: 15,
        color: '#989898c9',
        cursor: 'pointer',
        '&:hover': {
            color: '#828181',
        },
    },
    receiverUserRoot: {
        flex: '1 1 auto',
        padding: '0 25px 0 0',
        minWidth: 0,
        textAlign: 'center',
    },
    bodyMessageRoot: {
        padding: '20px 0px',
        height: 'calc(100% - 110px)',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    messageRoot: {
        display: 'flex',
    },
    messageRootRight: {
        marginLeft: 'auto',
    },
    messageAvatar: {
        border: '1px solid #ffffff8c',
    },
    messageText: {
        padding: 12,
        maxWidth: 320,
        marginTop: 4,
        borderRadius: 8,
        backgroundColor: '#F4F6F8',
    },
    listContainer: {
        paddingTop: 0,
        height: '100%',
    },
    rightSideChatRoot: {
        padding: '0 0 !important',
    },
    leftSideChatRoot: {
        backgroundColor: '#4F4484',
        padding: '0 0px !important',
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    activeUserItem: {
        borderRight: '4px solid',
        boderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    messageTextRight: {
        backgroundColor: '#C8FACD',
        padding: 12,
        maxWidth: 320,
        marginTop: 4,
        borderRadius: 8,
    },
    sendMessageRoot: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        bottom: 0,
        position: 'absolute',
        padding: '10px 0px',
    },
    messageField: {
        margin: '0px 1px 0px 16px',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: '3px 10px',
    },
    messageInput: {
        fontSize: 13,
        fontWeight: 300,
    },
    paperEmoji: {
        width: 300,
        height: 270,
        outline: 'none',
        position: 'absolute',
        minWidth: '16px',
        maxWidth: 'calc(100% - 32px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '16px',
        maxHeight: 'calc(100% - 32px)',
    },
    fullPageEmojiXs: {
        [theme.breakpoints.down('xs')]: {
            // width: '100%',
            // height: '100%',
            margin: 0,
            overflowY: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            // top: '0 !important',
            // left: '0 !important',
            // position: 'fixed',
            borderRadius: 0,
        },
    },
    container: {
        margin: 0,
        width: '100% !important',
        height: '100% !important',
    },
    fullPageXs: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
            margin: 0,
            overflowY: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            top: '0 !important',
            left: '0 !important',
            position: 'fixed',
            borderRadius: 0,
        },
    },
    noDisplay: {
        display: 'none',
    },
    header: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    menuItem: {
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent: 'center',
    },
    loading: {
        position: 'absolute',
        left: '-25px',
        top: 0,
        width: 30,
        height: 30,
    },
    messageBox: {
        marginLeft: 16,
    },
    updatedDate: {
        color: ' #637381',
        display: 'flex',
        marginBottom: 6,
        '&.me': {
            justifyContent: 'flex-end',
        },
    },
});
