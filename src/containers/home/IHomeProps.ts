import { Map, List as ImuList } from 'immutable';
export type IHomeProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Styles
     */
    classes?: any;

    /**
     * Theme
     */
    theme?: any;
}

export interface IStateProps {
    /**
     * Current user is authenticated {true} or not {false}
     */
    authed: boolean;

    /**
     * Current user info
     */
    currentUser: Map<string, any>;

    /**
     * Whether chat is open
     */
    isChatOpen: boolean;

    /**
     * If all requierment data loaded {true} or not {false}
     */
    loaded: boolean;

    activeRooms: ImuList<Map<string, any>>;
}

export interface IDispatchProps {
    /**
     * Open chat
     */
    openChat: () => any;

    /**
     * Close chat
     */
    closeChat: () => any;

    /**
     * Show send feedback form
     */
    showSendFeedback: () => any;

    /**
     * Hide send feedback form
     */
    hideSendFeedback: () => any;

    /**
     * Redirect to [url]
     */
    goTo: (url: string) => any;

    /**
     * Set flag {true} which all user data has loaded
     */
    defaultDataEnable: Function;
    /**
     * Load user data into store
     */
    loadData: Function;

    /**
     * Set flag {false} which user data has not loaded
     */
    defaultDataDisable: Function;
}
