import { Map } from 'immutable';

export type IPostProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Post object
     */
    post: Map<string, any>;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Class name
     */
    className?: string;
}

export interface IStateProps {
    commentList: Map<string, Map<string, any>>;
    currentUser: Map<string, any>;
    voteCount: number;
    currentUserVote: boolean;
    isPostOwner: boolean;
}

export interface IDispatchProps {
    vote: () => any;
    unvote: () => any;
    delete: (id: string) => any;
    toggleDisableComments: (status: boolean) => any;
    toggleSharingComments: (status: boolean) => any;
    goTo: (url: string) => any;
    setHomeTitle: (title: string) => any;
    getPostComments: (ownerUserId: string, postId: string, page: number, limit: number) => any;
    setPostWriteModel: (model: Map<string, any>) => any;
    openPostWrite: () => any;
}
