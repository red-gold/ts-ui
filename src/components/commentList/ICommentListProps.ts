import { Map } from 'immutable';

export interface ICommentListProps {
    /**
     * Ad dictionary of comment
     *
     * @type {{[commentId: string]: Comment}}
     */
    comments: Map<string, Map<string, any>>;

    /**
     * Comments editor status
     */
    editorStatus: Map<string, any>;

    /**
     * Current user is post the post owner {true} or not false
     *
     * @type {boolean}
     */
    isPostOwner: boolean;

    /**
     * The post identifier comments belong to
     */
    postId: string;

    /**
     * Comment on the post is disabled {false} or not {true}
     *
     * @type {boolean}
     */
    disableComments: boolean;

    /**
     * Styles
     */
    classes?: any;
}
