import { Feed } from 'core/domain/common/feed';
import { Map } from 'immutable';

/**
 * Common service interface
 */
export interface ICommonService {
    /**
     * Get twitter media
     */
    getTwitterMedia: (accessToken: string) => Promise<Map<string, any>>;

    /**
     * Post feedback
     */
    addFeed: (feed: Feed) => Promise<string>;
}
