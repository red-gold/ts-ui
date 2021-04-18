// - Import react components
import { withStyles } from '@material-ui/core/styles';
import ChatMessageComponent from 'components/chatMessage/ChatMessageComponent';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { chatBodyStyles } from './chatBodyStyles';
import { IChatBodyProps } from './IChatBodyProps';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export function ChatBodyComponent(props: IChatBodyProps & WithTranslation) {
    const scrollableRootRef = useRef<HTMLDivElement | null>(null);
    const lastScrollDistanceToBottomRef = useRef<number>();

    const [didMount, setDidMount] = useState(false);
    const [openRoomDate] = useState(new Date().getTime());
    const [nextOldPage, setNextOldPage] = useState(1);
    const [isScrollEnd, setIsScrollEnd] = useState(false);

    const loadingUp = props.oldQueryMessageStatus === ServerRequestStatusType.Sent;
    /**
     * Loader for scroll up
     */
    const upLoader = () => {
        const { queryMessage, oldQueryMessageRequestId, room } = props;
        const roomId = room.get('objectId');

        queryMessage(oldQueryMessageRequestId, roomId, nextOldPage, openRoomDate, 0);

        setNextOldPage(nextOldPage + 1);
    };

    const [sentryRefUp, { rootRef }] = useInfiniteScroll({
        loading: loadingUp,
        hasNextPage: props.hasMoreOldMessages,
        onLoadMore: upLoader,
        disabled: false,
        delayInMs: 100,
        rootMargin: '400px 0px 0px 0px',
    });

    const { classes, chatMessages, currentUser, receiverUser } = props;

    const rootRefSetter = useCallback(
        (node: HTMLDivElement) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef],
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            if (rootNode.offsetHeight + rootNode.scrollTop >= rootNode.scrollHeight) {
                const { handleReadMessage } = props;
                if (chatMessages.size > 0) {
                    handleReadMessage(chatMessages.last());
                }
                !isScrollEnd && setIsScrollEnd(true);
            } else {
                isScrollEnd && setIsScrollEnd(false);
                const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
                lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
            }
        }
    }, [chatMessages.size]);

    // We keep the scroll position when new items are added etc.
    useEffect(() => {
        if (!didMount) {
            setDidMount(true);
        }
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom = lastScrollDistanceToBottomRef.current ?? 0;
        if (scrollableRoot) {
            if (isScrollEnd || !(loadingUp || props.hasMoreOldMessages)) {
                scrollableRoot.scrollTop = scrollableRoot.scrollHeight;
            } else {
                scrollableRoot.scrollTop = scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
            }
        }
    }, [chatMessages, rootRef]);

    return (
        <div id="chat-body-scroll" className={classes.bodyMessageRoot} ref={rootRefSetter} onScroll={handleRootScroll}>
            <div>
                {(loadingUp || props.hasMoreOldMessages) && <h3 ref={sentryRefUp}>Loading......</h3>}

                {chatMessages
                    ? chatMessages
                          .map((message) => (
                              <ChatMessageComponent
                                  key={message.get('objectId')}
                                  me={message.get('isCurrentUser')}
                                  text={message.get('text')}
                                  updatedDate={message.get('updatedDate')}
                                  avatar={receiverUser.get('avatar')}
                                  ownerName={receiverUser.get('fullName')}
                                  currentUser={currentUser}
                                  loading={false}
                              />
                          ))
                          .valueSeq()
                    : ''}
            </div>
        </div>
    );
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(ChatBodyComponent);

export default withStyles(chatBodyStyles)(translateWrapper);
