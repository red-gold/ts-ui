import { Map, List } from 'immutable';

export type ISearchUserProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Theme
     */
    history?: any;

    /**
     * Router match
     */
    location: any;

    /**
     * Styles
     */
    classes?: any;
}

export interface IStateProps {
    /**
     * Users' profile
     */
    peopleInfo: List<Map<string, any>>;

    /**
     * If there are more people {true} or not {false}
     */
    hasMorePeople: boolean;
}

export interface IDispatchProps {
    /**
     * Search posts
     */
    search: (query: string, page: number, limit: number) => any;
}
