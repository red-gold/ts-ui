import { Map } from 'immutable';
import { createSelector } from 'reselect';

/****************************
 * Get from store
 ***************************/
const getRequest = (state: Map<string, any>, props: { requestId: string }) => {
    return state.getIn(['server', 'request', props.requestId], Map({}));
};

const getRequests = (state: Map<string, any>) => {
    return state.getIn(['server', 'request'], Map({}));
};

/****************************
 * Selectors
 ***************************/
const selectRequest = () => {
    return createSelector(getRequest, (request) => request);
};

const selectRequests = () => {
    return createSelector(getRequests, (requests) => requests);
};

export const serverSelector = {
    getRequest,
    selectRequest,
    selectRequests,
};
