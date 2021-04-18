import { Map } from 'immutable';
export interface IPostComponentProps {
    /**
     * Post object
     */
    post: Map<string, any>;

    /**
     * Owner's post avatar
     */
    avatar?: string;

    /**
     * User full name
     */
    fullName?: string;

    /**
     * Number of vote on a post
     */
    voteCount?: number;

    /**
     * Current user vote the post {true} or not {false}
     */
    currentUserVote?: boolean;

    /**
     * Current user is the owner of the post {true} or not {false}
     */
    isPostOwner?: boolean;

    /**
     * Vote a post
     */
    vote?: () => any;

    /**
     * Delete a vote on the post
     */
    unvote?: () => any;

    /**
     * Delte a post
     */
    delete?: (id: string) => any;

    /**
     * Toggle comment disable/enable
     */
    toggleDisableComments?: (status: boolean) => any;

    /**
     * Toggle sharing disable/enable
     */
    toggleSharingComments?: (status: boolean) => any;

    /**
     * Redirect to {url} route
     */
    goTo?: (url: string) => any;

    /**
     * Set tile of top bar
     */
    setHomeTitle?: (title: string) => any;

    /**
     * Get the comments of a post
     */
    getPostComments?: (ownerUserId: string, postId: string, page: number, limit: number) => any;

    /**
     * Commnets
     */
    commentList?: Map<string, Map<string, any>>;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Class name
     */
    className?: string;

    /**
     * Translate to locale string
     */
    t?: (state: any) => any;
}
