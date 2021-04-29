import { Map } from 'immutable';
export interface IUserItemProps {
    /**
     * User
     */
    user: Map<string, any>;

    /**
     * Redirect page to [url]
     */
    goTo: (url: string) => any;

    /**
     * On click
     */
    onClick?: (user: Map<string, any>) => void;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any, param?: {}) => any;

    follow?: boolean;
    disableProfile?: boolean;
}
