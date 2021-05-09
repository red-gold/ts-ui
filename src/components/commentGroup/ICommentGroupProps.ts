import { Map } from 'immutable';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';

export type ICommentGroupProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Commnets
     */
    comments: Map<string, Map<string, any>>;

    /**
     * Commnets show on slide preview
     */
    commentSlides?: Map<string, Comment>;

    /**
     * The post identifier which comment belong to
     */
    postId: string;

    /**
     * Comment group is open {true} or not {false}
     */
    open: boolean;

    /**
     * Comment is disabled {true} or not {false}
     */
    disableComments: boolean;

    /**
     * Current user is the post owner {true} or not {false}
     */
    isPostOwner: boolean;

    /**
     * Toggle comment list open/close
     */
    onToggleRequest: () => void;

    /**
     * The identifier of post owner
     */
    ownerPostUserId: string;

    /**
     * Styles
     */
    classes?: any;
}

export interface IStateProps {
    commentsRequestStatus: ServerRequestStatusType;
    currentUser: Map<string, any>;
    editorStatus: Map<string, any>;
}

export interface IDispatchProps {
    send: (newComment: Map<string, any>) => void;
}
