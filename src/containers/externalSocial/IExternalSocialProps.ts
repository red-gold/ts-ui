import { User } from 'core/domain/users/user';
import { Map } from 'immutable';

export interface IExternalSocialProps {
    /**
     * Router match
     */
    match: any;

    /**
     * Current user profile
     */
    currentUser?: User;

    /**
     * Instagram posts
     */
    instagramPosts: Map<string, any>;

    /**
     * Load twitter media
     */
    loadTwitterMedia: (accessToken: string) => any;

    /**
     * Translate to locale string
     */
    t?: (state: any, params?: {}) => any;

    /**
     * Current social name
     */
    social: string | null;

    /**
     * Styles
     */
    classes?: any;
}
