import { Map, List } from 'immutable';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export type IProfileProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    match: any;
    location: any;
    history: any;
    classes?: any;
}

export interface IStateProps {
    profile: Map<string, any>;
    posts: List<Map<string, any>>;
    hasMorePosts: boolean;
    isCurrentUser: boolean;
    requestId: string;
    postsRequestStatus: ServerRequestStatusType;
}

export interface IDispatchProps {
    /**
     * Load user's post
     */
    loadPosts: (page: number) => any;

    /**
     * Load user's profile
     */
    loadUserInfo: () => any;

    /**
     * Set home header title
     */
    setHeaderTitle: (title: string) => any;
}
