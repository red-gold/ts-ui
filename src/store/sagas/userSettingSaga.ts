import { UserSettingActionType } from 'constants/userSettingActionType';
import { IUserSettingService } from 'core/services/users/IUserSettingService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as globalActions from 'store/actions/globalActions';
import * as userSettingActions from 'store/actions/userSettingActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { UserSetting } from 'core/domain/users/userSetting';

/**
 * Get service providers
 */
const userSettingService: IUserSettingService = provider.get<IUserSettingService>(
    SocialProviderTypes.UserSettingService,
);

/***************************** Subroutines ************************************/

/**
 * Fetch user setting
 */
function* dbFetchUserSetting() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            const result = yield call(userSettingService.getUserSettings);
            yield put(userSettingActions.setUserSetting(result));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Update user setting
 */
function* dbUpdateUserSetting(action: { type: UserSettingActionType; payload: any }) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        const { payload } = action;
        try {
            const reqPayload = new UserSetting(payload.type, 0, uid, []);
            payload.setting.forEach((item: any) => {
                reqPayload.list.push(item.toJS());
            });
            yield call(userSettingService.updateUserSetting, reqPayload);
            yield put(userSettingActions.updateUserSetting(payload.type, payload.setting));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

export default function* userSettingSaga() {
    yield all([
        takeLatest(UserSettingActionType.DB_FETCH_USER_SETTING, dbFetchUserSetting),
        takeLatest(UserSettingActionType.DB_UPDATE_USER_SETTING, dbUpdateUserSetting),
    ]);
}
