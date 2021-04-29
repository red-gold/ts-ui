import { List as ImuList, Map } from 'immutable';

export type IContactsProps = IOwnProps & IDispatchProps & IStateProps;

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
    contacts: ImuList<Map<string, any>>;

    /**
     * Whether contacts is loaded or not
     */
    contactsLoaded: boolean;
}

export interface IDispatchProps {
    goTo: (url: string) => any;
    openRoom: (roomId: string) => any;
}
