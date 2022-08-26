// - Import image gallery action types
import { GlobalActionType } from 'constants/globalActionType';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import i18n from 'locales/i18n';
import { DialogType } from 'models/common/dialogType';
import StringAPI from 'api/StringAPI';
import { Feed } from 'core/domain/common/feed';
import { SocialError } from 'core/domain/common/socialError';
import { ICommonService } from 'core/services/common/ICommonService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ServerRequestModel } from 'models/server';
import * as serverActions from 'redux/actions/serverActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { createPromiseAction } from '@adobe/redux-saga-promise';
import { provider } from '../../socialEngine';

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);

/**
 * Add a normal feed
 */
export const dbSendFeed = (newFeed: Feed) => {
    return (dispatch: (action: any) => any, getState: () => any): any => {
        const state: Map<string, any> = getState();
        const uid = state.getIn(['authorize', 'uid']) as string;

        // Set server request status to {Sent}
        const feedbackRequest = createFeedbackRequest(uid);
        dispatch(serverActions.sendRequest(feedbackRequest));

        return commonService
            .addFeed(newFeed)
            .then(() => {
                // Set server request status to {OK}
                feedbackRequest.status = ServerRequestStatusType.OK;
                dispatch(serverActions.sendRequest(feedbackRequest));
            })
            .catch((error: SocialError) => {
                dispatch(showMessage(error.message));

                // Set server request status to {Error}
                feedbackRequest.status = ServerRequestStatusType.Error;
                dispatch(serverActions.sendRequest(feedbackRequest));
            });
    };
};

// - Show notification of request
export const showNotificationRequest = () => {
    return (dispatch: (action: any) => any): any => {
        return dispatch(showMessage(i18n.t('common.sentRequestMessage')));
    };
};

// - Show notification of success
export const showNotificationSuccess = () => {
    return (dispatch: (action: any) => any): any => {
        return dispatch(showMessage(i18n.t('common.successfulRequestMessage')));
    };
};

// - Internal request------------------

/**
 * Set search request
 */
export const setSearchRequest = (percent: number, visible: boolean): any => {
    return {
        type: GlobalActionType.PROGRESS_CHANGE,
        payload: { percent, visible },
    };
};

/**
 * Progress change
 */
export const progressChange = (percent: number, visible: boolean): any => {
    return {
        type: GlobalActionType.PROGRESS_CHANGE,
        payload: { percent, visible },
    };
};

/**
 * Progress change with key
 */
export const progressChangeWithKey = (
    percent: number,
    visible: boolean,
    progressKey: string,
    meta?: Record<string, any>,
): any => {
    return {
        type: GlobalActionType.PROGRESS_CHANGE_WITH_KEY,
        payload: { percent, visible, progressKey, meta },
    };
};

/**
 * Initialize locale
 */
export const initLocale = (): any => {
    return {
        type: GlobalActionType.INIT_LOCALE,
        payload: null,
    };
};

/**
 * Default data loaded status will be true
 */
export const defaultDataEnable = (): any => {
    return {
        type: GlobalActionType.DEFAULT_DATA_ENABLE,
    };
};

/**
 * Default data loaded status will be false
 * @param {boolean} status
 */
export const defaultDataDisable = (): any => {
    return {
        type: GlobalActionType.DEFAULT_DATA_DISABLE,
    };
};

/**
 * Show message
 */
export const showMessage = (message: string): any => {
    if (!message || message === '' || (message && message.trim() === '')) {
        message = 'Bad request';
    }
    return {
        type: GlobalActionType.SHOW_MESSAGE_GLOBAL,
        payload: { message },
    };
};

/**
 * Hide global message
 */
export const hideMessage = (): any => {
    hideTopLoading();
    return {
        type: GlobalActionType.HIDE_MESSAGE_GLOBAL,
    };
};

/**
 * Show message by reference
 */
export const showMessageByReference = (message: string, referenceKey: string, showGlobal?: boolean): any => {
    if (!message || message === '' || (message && message.trim() === '')) {
        message = 'Bad request';
    }
    return {
        type: GlobalActionType.SHOW_MESSAGE_BY_REFERENCE,
        payload: { message, referenceKey, showGlobal },
    };
};

/**
 * Hide message by reference
 */
export const hideMessageByReference = (): any => {
    hideTopLoading();
    return {
        type: GlobalActionType.HIDE_MESSAG_BY_REFERENCE,
    };
};

/**
 * Set header title
 */
export const setHeaderTitleOpt = (callerKey: string, payload: string): any => {
    return (dispatch: any, getState: () => any) => {
        switch (callerKey) {
            case 'profile':
                const userName =
                    getState().user.info && getState().user.info[payload] ? getState().user.info[payload].fullName : '';
                dispatch(setHeaderTitle(userName));
                break;
            default:
                break;
        }
    };
};

/**
 * Set header title
 */
export const setHeaderTitle = (text: string): any => {
    return {
        type: GlobalActionType.SET_HEADER_TITLE,
        payload: text,
    };
};

/**
 * Open post write
 */
export const openPostWrite = (): any => {
    return {
        type: GlobalActionType.OPEN_POST_WRITE,
    };
};

/**
 * Close post write
 */
export const closePostWrite = (): any => {
    return {
        type: GlobalActionType.CLOSE_POST_WRITE,
    };
};

/**
 * Show top loading
 */
export const showTopLoading = (): any => {
    return {
        type: GlobalActionType.SHOW_TOP_LOADING,
    };
};

/**
 * Hide top loading
 */
export const hideTopLoading = (): any => {
    return {
        type: GlobalActionType.HIDE_TOP_LOADING,
    };
};

/**
 * Show master loading
 */
export const showMasterLoading = (): any => {
    return {
        type: GlobalActionType.SHOW_MASTER_LOADING,
    };
};

/**
 * Show send feedback
 */
export const showSendFeedback = (): any => {
    return {
        type: GlobalActionType.SHOW_SEND_FEEDBACK,
    };
};

/**
 * Hide send feedback
 */
export const hideSendFeedback = (): any => {
    return {
        type: GlobalActionType.HIDE_SEND_FEEDBACK,
    };
};

/**
 * Hide master loading
 */
export const hideMasterLoading = (): any => {
    return {
        type: GlobalActionType.HIDE_MASTER_LOADING,
    };
};

/**
 * Store temp data
 */
export const temp = (data: Record<string, any>): any => {
    return {
        type: GlobalActionType.TEMP,
        payload: data,
    };
};

/**
 * Clear temp data
 */
export const clearTemp = (): any => {
    return {
        type: GlobalActionType.CLEAR_ALL_GLOBAL,
    };
};

// - Load data for guest
export const loadDataGuest = () => {
    // tslint:disable-next-line:no-empty
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (dispatch: Record<string, any>, getState: () => Record<string, any>): any => {};
};

// - Clear loaded data
export const clearLoadedData = () => {
    return {
        type: GlobalActionType.CLEAR_LOADED_DATA,
    };
};

// - Load initial data
export const loadInitialData: () => any = createPromiseAction(GlobalActionType.LOAD_INITIAL_DATA);

/**
 *  Open dialog
 */
export const openDialog = (type: DialogType) => {
    return {
        type: GlobalActionType.OPEN_DIALOG,
        payload: { type },
    };
};

/**
 * Close dialog
 */
export const closeDialog = (type: DialogType) => {
    return {
        type: GlobalActionType.CLOSE_DIALOG,
        payload: { type },
    };
};

/**
 * Create send feedback serevr request model
 */
const createFeedbackRequest = (userId: string) => {
    const requestId = StringAPI.createServerRequestId(ServerRequestType.CommonSendFeedback, userId);
    return new ServerRequestModel(ServerRequestType.CommonSendFeedback, requestId, '', ServerRequestStatusType.Sent);
};
