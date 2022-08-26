export interface IFollowDialogState {
    /**
     * Create new circle button is disabled {true} or not {false}
     */
    disabledCreateCircle: boolean;

    /**
     * Circle name
     */
    circleName: string;

    /**
     * Keep element
     */
    anchorEl?: any;

    /**
     * Whether current user changed the selected circles for referer user
     *
     */
    disabledDoneCircles: boolean;
}
