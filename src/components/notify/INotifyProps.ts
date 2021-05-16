export interface INotifyProps {
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
}
