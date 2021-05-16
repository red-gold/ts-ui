import { Map } from 'immutable';

export interface ICommentGroupProps {
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
}
