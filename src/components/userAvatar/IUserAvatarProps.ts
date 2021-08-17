export interface IUserAvatarProps {
    /**
     * Use for getting url address from server
     */
    src?: string;
    /**
     * User full name
     */
    displayName?: string;
    /**
     * Avatar style
     */
    style?: {};

    /**
     * Design theme
     */
    theme?: any;

    /**
     * Avatar size
     */
    size?: number;
    /**
     * Trigger on touch tap
     */
    onClick?: (event: any) => any;

    className?: any;
}
