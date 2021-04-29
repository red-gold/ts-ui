export interface IPostWriteButtonProps {
    /**
     * Post writing input is displayed {true} or not {false}
     */
    displayWriting?: boolean;

    /**
     * Open post write dialog
     */
    openPostWrite?: () => any;

    /**
     * Close post write dialog
     */
    closePostWrite?: () => any;

    /**
     * Array of tags in a post
     */
    tag?: string[];

    /**
     * Whether post write dialog is open
     */
    postWriteDilogOpen?: boolean;

    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    onClick?: (event: any) => void;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any) => any;

    /**
     * User full name
     */
    fullName?: string;

    /**
     * User avatar URL
     */
    avatar?: string;
}
