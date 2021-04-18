import { Map } from 'immutable';
export interface IChatState {
    [key: string]: any;
    newMessageCount: number;
    searchText: string;
    messageText: string;
    anchorElCurrentUser: any;
    emojiOpen: any;
    leftSideDisabled: boolean;
    rightSideDisabled: boolean;
    smallSize: boolean;
    isMinimized: boolean;
    settingDisplyed: boolean;
    isScrollEnd: boolean;
    lastReadMessage: Map<string, any>;
}
