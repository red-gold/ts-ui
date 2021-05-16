import { Map, List } from 'immutable';

export interface IUserBoxListProps {
    /**
     * Users in the circle
     */
    users: List<Map<string, any>>;
}
