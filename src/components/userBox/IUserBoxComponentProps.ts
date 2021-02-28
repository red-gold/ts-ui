import { Map } from 'immutable';
export interface IUserBoxComponentProps {
    /**
     * User identifier
     */
    userId: string;

    /**
     * User
     */
    user: Map<string, any>;

    /**
     * Avatar address
     */
    avatar?: string;

    /**
     * User full name
     */
    fullName?: string;

    /**
     * Redirect page to [url]
     */
    goTo?: (url: string) => any;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any, param?: {}) => any;
}
