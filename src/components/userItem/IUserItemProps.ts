import { Map } from 'immutable';
export interface IUserItemProps {
    /**
     * User
     */
    user: Map<string, any>;

    /**
     * On click
     */
    onClick?: (user: Map<string, any>) => void;

    follow?: boolean;
    disableProfile?: boolean;
}
