import { Map, List } from 'immutable';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export type IPostStreamProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    requestId: string;
    loadStream: (page: number) => any;
    hasMorePosts: boolean;
    posts: List<Map<string, any>>;
    requestStatus: ServerRequestStatusType;
}

export interface IStateProps {}

export interface IDispatchProps {}
