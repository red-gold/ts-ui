import { createStyles, Theme } from '@material-ui/core/styles';

export const chatStyles = (theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            right: 50,
            bottom: 1,
            left: 'unset !important',
            zIndex: 1100,
            height: 455,
            width: 328,
            overflow: 'hidden',
        },
        rootMinimized: {
            height: '42px',
        },
        oneColumn: {},
        primaryText: {
            fontSize: '12px !important',
            color: 'rgb(255, 255, 255) !important',
            fontWeight: 300,
        },
        secondaryText: {
            color: '#c1b7f59e',
            fontSize: 10,
            fontWeight: 300,
        },
        receiverSecondaryText: {},
        moreMenu: {
            color: 'rgb(255, 255, 255)',
        },
        headIcon: {
            fontSize: 20,
        },
        receiverMoreIcon: {
            fontSize: 20,
        },
        userItem: {
            paddingLeft: 7,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
        },
        receiverUserItem: {
            minHeight: 40,
        },
        listItemText: {
            marginLeft: 8,
            marginTop: 13,
        },
        searchInput: {
            fontSize: '10px !important',
            // color: 'rgb(200, 188, 255) !important'
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
            fontSize: 20,
            color: '#637381',
            lineHeight: 1,
            cursor: 'pointer',
            '&:hover': {
                color: '#828181',
            },
        },
        receiverUserRoot: {
            flex: '1 1 auto',
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
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
            flexDirection: 'row',
            padding: '0px 10px',
            marginBottom: 10,
        },
        messageRootRight: {
            display: 'flex',
            flexDirection: 'row-reverse',
            padding: '0px 10px',
        },
        messageAvatar: {
            border: '1px solid #ffffff8c',
            borderRadius: '50%',
        },
        messageText: {
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.14)',
            padding: '10px 6px',
            borderRadius: '8px',
            backgroundColor: 'white',
            margin: '0px 10px',
        },
        listContainer: {
            paddingTop: '0px !important',
            height: '100%',
            [theme.breakpoints.down('xs')]: {
                height: '100%',
            },
        },
        rightSideChatRoot: {
            height: '100%',
        },
        leftSideChatRoot: {
            backgroundColor: theme.palette.secondary.dark,
            padding: '0 0px !important',
            [theme.breakpoints.only('xs')]: {
                display: 'none',
            },
        },
        activeUserItem: {
            borderRight: '4px solid',
            borderColor: theme.palette.secondary.main,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
        messageTextRight: {
            backgroundColor: theme.palette.secondary.main,
        },
        sendMessageRoot: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            bottom: 0,
            [theme.breakpoints.down('xs')]: {
                position: 'fixed',
            },
        },
        messageField: {
            margin: '0px 1px 0px 16px !important',
            backgroundColor: 'white',
            'border-radius': '5px !important',
            padding: '3px 10px !important',
        },
        messageInput: {},
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
        currentUserItem: {
            margin: 0,
            padding: 0,
            position: 'relative',
            listStyle: 'none',
        },
        leftListContainer: {
            maxHeight: 310,
            overflowY: 'auto',
        },
        statusIcon: {
            width: 10,
            height: 10,
            alignItems: 'center',
            borderRadius: '30%',
            justifyContent: 'center',
            position: 'absolute',
            bottom: -3,
            right: 12,
            display: 'none',
            '&.online': {
                backgroundColor: '#54D62C',
                display: 'flex',
            },
            '&::before, &::after': {
                content: '""',
                borderRadius: 1,
                backgroundColor: '#fff',
            },
        },
        avatarRoot: {
            position: 'relative',
        },
        pickerRoot: {
            position: 'absolute',
            zIndex: 1,
        },
    });
