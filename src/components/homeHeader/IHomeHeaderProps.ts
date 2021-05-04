export type IHomeHeaderProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Sidebar is open {true} or not {false}
     */
    drawerStatus: boolean;

    /**
     * Handle on resize window event
     */
    handleResize?: (event: any) => void;

    /**
     * Location
     */
    location?: any;

    /**
     * History router
     */
    history?: any;

    /**
     * Toggle sidebar
     */
    onToggleDrawer: () => void;

    /**
     * Toggle messenger window
     */
    onToggleMessenger: () => void;

    /**
     * Material ui theme style
     */
    classes?: any;

    /**
     * Window width
     */
    width?: any;

    /**
     * Theme
     */
    theme?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any) => any;
}

export interface IStateProps {
    /**
     * Image cover address
     *
     */
    banner: string;

    /**
     * Number of notifications
     */
    notifyCount: number;

    unreadRoomsCount: number;

    /**
     * User full name
     */
    fullName: string;
    /**
     * User's avatar URL address
     */
    avatar: string;

    /**
     * Top bar title
     */
    title: string;

    // Whether profile account edit is open or not
    myProfileAccountOpen: boolean;

    postWriteOpen: boolean;
}

export interface IDispatchProps {
    /**
     * Redirect to URL
     */
    goTo: (url: string) => any;

    /**
     * Open edit profile dialog
     *
     */
    openEditor: () => void;

    /**
     * Logout user
     */
    logout: () => void;
}
