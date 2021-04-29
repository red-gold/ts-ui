import { Map, List } from 'immutable';

export interface IUserBoxListComponentProps {
    /**
     * Users in the circle
     */
    users: List<Map<string, any>>;

    /**
     * User identifier
     */
    uid?: string;

    goTo?: (url: string) => any;
}
