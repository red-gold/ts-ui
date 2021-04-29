import { List as ImuList, Map } from 'immutable';

export type IPeopleBoxProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Styles
     */
    classes?: any;
}

export interface IStateProps {
    /**
     * Current user
     */
    currentUser: Map<string, any>;

    /**
     * User suggestions
     */
    userSuggestions: ImuList<Map<string, any>>;
}

export interface IDispatchProps {
    goTo: (url: string) => any;
    fetchUserSuggestions: () => any;
}
