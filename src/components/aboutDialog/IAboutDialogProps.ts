import { User } from 'core/domain/users/user';
import { ImuMap } from 'core/ImuMap';

export interface IAboutDialogProps {
    /**
     * Whether dialog is open
     */
    open: boolean;

    /**
     * Close image gallery
     */
    onClose: () => void;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Theme
     */
    theme?: any;

    /**
     * Current user information
     */
    currentUser?: User;

    /**
     * The user to show about
     */
    targetUser: ImuMap<User>;

    /**
     * Translate to locale string
     */
    t?: (state: any) => any;

    /**
     * Current language code
     */
    currentLanguage?: string;
}
