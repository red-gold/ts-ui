import { Map, List } from 'immutable';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export type IStreamProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Router match property
     */
    match?: any;

    /**
     * Styles
     */
    classes?: any;
}

export interface IStateProps {
    /**
     * If there is more post {true} or not {false}
     */
    hasMorePosts: boolean;

    /**
     * Current user
     */
    currentUser: Map<string, any>;

    streamRequestStatus: ServerRequestStatusType;

    /**
     * Posts for stream
     */
    posts: List<Map<string, any>>;

    /**
     * Stream request id
     */
    requestId: string;

    /**
     * Current page number
     */
    page: number;
}

export interface IDispatchProps {
    /**
     * Load the data for stream
     */
    loadStream: (page: number, limit: number) => any;

    /**
     * Set home title
     */
    setHomeTitle: (homeTitle: string) => void;

    /**
     * Translate to locale string
     */
    increasePage: () => any;
}
