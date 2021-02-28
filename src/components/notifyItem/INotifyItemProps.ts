export interface INotifyItemProps {
    /**
     * Notification description
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    description: string;

    /**
     * User full name
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    fullName: string;

    /**
     * User avatar
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    avatar: string;

    /**
     * Notification has seen {true} or not {false}
     *
     * @type {boolean}
     * @memberof INotifyItemProps
     */
    isSeen: boolean;

    /**
     * Notification identifier
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    id: string;

    /**
     * Rediret to {url} route
     *
     * @memberof INotifyItemProps
     */
    goTo?: (url: string) => any;

    /**
     * Close a notification
     *
     * @memberof INotifyItemProps
     */
    closeNotify?: () => void;

    /**
     * Notifier identifier
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    notifierUserId: string;

    /**
     * The URL which notification mention
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    url: string;

    /**
     * Delete a notification
     *
     * @memberof INotifyItemProps
     */
    deleteNotiy?: (notificationId: string) => any;

    /**
     * Change notification status to has seen
     *
     * @memberof INotifyItemProps
     */
    seenNotify?: (notificationId: string) => any;

    /**
     * Material ui styles
     */
    classes?: any;
}
