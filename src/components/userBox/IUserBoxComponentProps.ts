import { Map } from 'immutable';
export interface IUserBoxComponentProps {
    /**
     * User
     */
    user: Map<string, any>;

    /**
     * Redirect page to [url]
     */
    goTo: (url: string) => any;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any, param?: {}) => any;
}
