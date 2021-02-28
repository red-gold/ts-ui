import { List, Map } from 'immutable';

/**
 * Global state
 *
 * @export
 * @class GlobalState
 */
export class GlobalState {
    /**
     * Set percent of loading progress and visibility for Master component
     *
     * @type {{
     *     percent: number,
     *     visible: boolean
     *   }}
     * @memberof IGlobalState
     */
    progress = Map({
        percent: 0,
        visible: false,
    });

    /**
     * If loading is enabled {true} or not false
     *
     * @type {boolean}
     * @memberof IGlobalState
     */
    loadingStatus = true;

    /**
     * Whether send feedback is diplayed
     */
    sendFeedbackStatus = false;

    /**
     * If user date is loaded {true} or not {false}
     *
     * @type {boolean}
     * @memberof IGlobalState
     */
    defaultLoadDataStatus = false;

    /**
     * If message popup is open {true} or not {false}
     *
     * @type {boolean}
     * @memberof IGlobalState
     */
    messageOpen = false;

    /**
     * The text of popup global message
     *
     * @type {string}
     * @memberof IGlobalState
     */
    message = '';

    /**
     * Window size
     *
     * @type {number}
     * @memberof IGlobalState
     */
    windowWidth = 0;

    /**
     * Window height
     *
     * @type {number}
     * @memberof IGlobalState
     */
    windowHeight = 0;

    /**
     * The text of website header
     *
     * @type {string}
     * @memberof IGlobalState
     */
    headerTitle = '';

    /**
     * Top loading is visible {true} or not {false}
     *
     * @type {boolean}
     * @memberof IGlobalState
     */
    showTopLoading = false;

    /**
     * Top loading message queue
     *
     * @type {number}
     * @memberof IGlobalState
     */
    topLoadingQueue = 0;

    /**
     * Master loading is visible {true} or not {false}
     *
     * @type {boolean}
     * @memberof IGlobalState
     */
    showMasterLoading = true;

    /**
     * Master loading message queue
     *
     * @type {number}
     * @memberof IGlobalState
     */
    masterLoadingQueue = 0;

    /**
     * Temp date storage
     *
     * @type {*}
     * @memberof IGlobalState
     */
    temp: any = Map({
        caller: List(),
    });
}
