import { Map, List } from 'immutable';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export type ISearchPostProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    match: any;
    location: any;
    homeTitle?: string;
    history?: any;
    classes?: any;
}

export interface IStateProps {
    currentUser: Map<string, any>;
    hasMorePosts: boolean;
    searchRequestStatus: ServerRequestStatusType;
    requestId: string;
    posts: List<Map<string, any>>;
}

export interface IDispatchProps {
    search: (query: string, page: number, limit: number) => any;
}
