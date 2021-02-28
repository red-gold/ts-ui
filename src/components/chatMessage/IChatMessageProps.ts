import { User } from 'core/domain/users/user';

export interface IChatMessageProps {
    /**
     * Translate to locale string
     */
    t?: (state: any) => any;

    /**
     * Whether is loding state
     */
    loading: boolean;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Current user
     */
    currentUser: User;

    /**
     * Whether message direction is right to left
     */
    rtl: boolean;

    /**
     * Text message
     */
    text: string;

    /**
     * Message owner avatar address
     */
    avatar: string;

    /**
     * Message owner name
     */
    ownerName: string;
}
