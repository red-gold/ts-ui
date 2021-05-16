import { UserSettingActionType } from 'constants/userSettingActionType';
import { Map } from 'immutable';

import { IUserSettingAction } from './IUserSettingAction';

// - Import action types
// Import domain

/**
 * UserSetting actions
 */
export const userSettingReducer = (state = Map({}), action: IUserSettingAction) => {
    const { payload } = action;
    switch (action.type) {
        case UserSettingActionType.SET_USER_SETTING:
            return state.set('entities', payload);

        case UserSettingActionType.UPDATE_USER_SETTING:
            return state.setIn(['entities', payload.key], payload.data);

        case UserSettingActionType.CLEAR_ALL_USER_SETTING:
            return Map({});

        default:
            return state;
    }
};
