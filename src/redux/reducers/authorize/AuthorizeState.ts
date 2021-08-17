/**
 * Post state
 *
 * @export
 * @class AuthorizeState
 */
export class AuthorizeState {
    /**
     * Authorized user identifier
     *
     * @type {number}
     * @memberof AuthorizeState
     */
    uid = 0;

    /**
     * If user is authed {true} or not {false}
     *
     * @type {boolean}
     * @memberof AuthorizeState
     */
    authed = false;

    /**
     * If user is verifide {true} or not {false}
     *
     * @type {boolean}
     * @memberof AuthorizeState
     */
    isVerifide = false;

    /**
     * If user password is updated {true} or not {false}
     *
     * @type {boolean}
     * @memberof AuthorizeState
     */
    updatePassword = false;

    /**
     * If the user is guest {true} or not {false}
     *
     * @type {boolean}
     * @memberof AuthorizeState
     */
    guest = false;
}
