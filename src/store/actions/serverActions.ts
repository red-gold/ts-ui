import { ServerActionType } from 'constants/serverActionType';
import { Map } from 'immutable';

import { ServerRequestModel } from 'models/server/serverRequestModel';
import { SocialError } from 'core/domain/common/socialError';

/**
 * Add a request
 * @param {Request} request
 */
export const sendRequest = (request: ServerRequestModel) => {
    return { type: ServerActionType.SET_REQUEST, payload: { request: Map({ ...request }) } };
};

/**
 * delete a request
 */
export const deleteRequest = (id: string) => {
    return { type: ServerActionType.DELETE_REQUEST, payload: { id } };
};

/**
 * Update request stattus ti successful
 */
export const okRequest = (id: string) => {
    return { type: ServerActionType.OK_REQUEST, payload: { id } };
};

/**
 * Set error request
 */
export const errorRequest = (id: string, error: SocialError) => {
    return { type: ServerActionType.ERROR_REQUEST, payload: { id, error } };
};

/**
 * Clear all data
 */
export const clearAllrequests = () => {
    return { type: ServerActionType.CLEAR_ALL_DATA_REQUEST };
};
