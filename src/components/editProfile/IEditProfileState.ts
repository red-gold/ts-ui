import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Map } from 'immutable';

export interface IEditProfileState {
    [key: string]: any;

    errors: Map<string, string>;

    /**
     * Full name input value
     */
    fullNameInput: string;

    /**
     * Whether image editor is open
     */
    isImageEditorOpen: boolean;

    /**
     * Image URL of image editor
     */
    imageEditorUrl: string;

    /**
     * User's original banner URL
     */
    originalBanner: string;

    /**
     * Tag line input value
     */
    tagLineInput: string;

    /**
     * Edit profile page is small size {true} or big {false}
     */
    isSmall: boolean;

    /**
     * User's banner URL
     */
    banner: string;

    /**
     * User's avatar URL address
     */
    avatar: string;

    /**
     * Image gallery dialog is open for choosing banner image {true} or not {false}
     */
    openBanner: boolean;

    /**
     * Image gallery dialog is open for choosing avatar image {true} or not {false}
     */
    openAvatar: boolean;

    /**
     * Seleted birth day
     */
    selectedBirthday: Date | null;

    /**
     * Web URL
     */
    webUrl: string;

    /**
     * User company name
     */
    companyName: string;

    /**
     * User twitter id
     */
    twitterId: string;

    /**
     * User facebook id
     */
    facebookId: string;

    /**
     * User facebook id
     */
    permission: UserPermissionType;

    /**
     * User facebook id
     */
    accessUserList: string[];
}
