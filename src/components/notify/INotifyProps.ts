import { Map } from 'immutable';

export type INotifyProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Close notification
     */
    onClose: () => void;

    /**
     * User notifications popover is opem {true} or not {false}
     */
    open: boolean;

    /**
     * Keep element
     */
    anchorEl?: any;

    /**
     * Material ui styles
     */
    classes?: any;
}

export interface IStateProps {
    /**
     * Notifications
     */
    notifications: Map<string, any>;

    /**
     * Users' profile
     */
    info?: Map<string, any>;
}

export interface IDispatchProps {
    goTo: (url: string) => any;
    seenNotify: (id: string) => any;
    deleteNotify: (id: string) => any;
}
