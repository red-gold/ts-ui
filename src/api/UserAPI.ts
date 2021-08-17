import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestModel } from 'models/server';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

/**
 * Creat user search request
 */
const createUserSearchRequest = (userId: string) => {
    const requestId = StringAPI.createServerRequestId(ServerRequestType.UserFetchRequest, userId);
    return new ServerRequestModel(ServerRequestType.UserFetchRequest, requestId, '', ServerRequestStatusType.Sent);
};

/**
 * Creat user fetch sugestions
 */
const createUserFetchSuggestions = () => {
    const requestType = ServerRequestType.UserFetchSuggestions;
    const requestId = StringAPI.createServerRequestId(requestType, 'user-fetch-sugestions');
    return new ServerRequestModel(requestType, requestId, '', ServerRequestStatusType.Sent);
};

export const UserAPI = {
    createUserSearchRequest,
    createUserFetchSuggestions,
};
