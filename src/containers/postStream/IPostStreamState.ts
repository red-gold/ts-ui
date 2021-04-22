import { Map } from 'immutable';

export interface IPostStreamState {
    /**
     * Posts for stream
     */
    posts: Map<string, Map<string, any>>;

    /**
     * Posts for stream
     */
    prevPosts: Map<string, Map<string, any>>;
}
