import { User } from 'core/domain/users/user';
import { ImuMap } from 'core/ImuMap';

export interface IUserActivityComponentProps {
    /**
     * Open edit profile dialog
     */
    openEditor?: () => void;

    /**
     * Translate to locale string
     */
    t?: (state: any, params?: any) => any;

    /**
     * It's current user profile {true} or not {false}
     */
    isCurrentUser: boolean;

    /**
     * Whether edit profile is open
     */
    editProfileOpen?: boolean;

    /**
     * User profile
     */
    profile: ImuMap<User>;

    chatRequest?: (userId: string) => any;

    /**
     * Styles
     */
    classes?: any;
}
