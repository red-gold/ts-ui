import { ServerActionType } from 'constants/serverActionType';
import { Map } from 'immutable';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

import { IServerAction } from './IServerAction';
import { ServerState } from './ServerState';

export const serverReducer = (state = Map(new ServerState() as any), action: IServerAction) => {
    const { payload } = action;
    switch (action.type) {
        case ServerActionType.SET_REQUEST:
            return state.setIn(['request', payload.request.get('id', 'no-id')], payload.request);

        case ServerActionType.DELETE_REQUEST:
            return state.deleteIn(['request', payload.id]);

        case ServerActionType.ERROR_REQUEST:
            return state
                .setIn(['request', payload.id, 'status'], ServerRequestStatusType.Error)
                .setIn(['request', payload.id, 'error', 'code'], payload.error.code)
                .setIn(['request', payload.id, 'error', 'message'], payload.error.message);

        case ServerActionType.OK_REQUEST:
            return state.setIn(['request', payload.id, 'status'], ServerRequestStatusType.OK);

        case ServerActionType.CLEAR_ALL_DATA_REQUEST:
            return Map(new ServerState() as any);

        default:
            return state;
    }
};
