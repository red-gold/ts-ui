import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
/**
 * User service interface
 *
 * @export
 * @interface IUserService
 */
export interface IUserService {
    getUserProfile: (userId: string) => Promise<User>;
    getProfileBySocialName: (socialName: string) => Promise<User>;
    getCurrentUserProfile: () => Promise<Record<string, any>>;
    updateUserProfile: (userId: string, profile: User) => Promise<void>;
    getUsersProfile: (
        userId: string,
        lastUserId?: string,
        page?: number,
        limit?: number,
    ) => Promise<{ users: { [userId: string]: User }[]; newLastUserId: string }>;

    increaseShareCount: (userId: string) => Promise<void>;

    /**
     * Get search key
     */
    getSearchKey: () => Promise<string>;

    searchUser: (
        query: string,
        filters: string,
        page: number,
        limit: number,
        nin: string[],
    ) => Promise<{ users: Map<string, any>; ids: Map<string, boolean>; hasMore: boolean }>;

    decreaseShareCount: (userId: string) => Promise<void>;

    increaseFollowCount: (userId: string) => Promise<void>;

    decreaseFollowCount: (userId: string) => Promise<void>;
}
