import { Map } from 'immutable';
import { User } from 'core/domain/users/user';

export interface IPostPageProps {
    /**
     * Load the post
     */
    loadPost?: () => any;

    /**
     * Load user profile
     */
    loadUserInfo?: () => any;

    /**
     * Route match
     */
    match?: any;

    /**
     * User information
     */
    userInfo?: User;

    /**
     * Post
     */
    post?: Map<string, any>;

    /**
     * Classes style
     */
    classes?: any;
}
