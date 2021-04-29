import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
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
     * Whether message direction is right to left for current
     */
    me: boolean;

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

    updatedDate: number;
}
