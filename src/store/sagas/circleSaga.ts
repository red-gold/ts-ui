import { CircleActionType } from 'constants/circleActionType';
import { ICircleService } from 'core/services/circles/ICircleService';
import { IUserTieService } from 'core/services/circles/IUserTieService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as circleActions from 'store/actions/circleActions';
import * as globalActions from 'store/actions/globalActions';
import * as userActions from 'store/actions/userActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

/**
 * Get service providers
 */
const circleService: ICircleService = provider.get<ICircleService>(SocialProviderTypes.CircleService);
const userTieService: IUserTieService = provider.get<IUserTieService>(SocialProviderTypes.UserTieService);

/***************************** Subroutines ************************************/

/**
 * Fetch circles
 */
function* dbFetchCircle() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            const circles: Map<string, Map<string, any>> = yield call(circleService.getCircles, uid);

            yield put(circleActions.addCircles(circles));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Fetch user ties
 */
function* dbFetchUserTies() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            const result: Map<string, any> = yield call(userTieService.getUserTies, uid);
            yield put(userActions.addPeopleInfo(result));
            yield put(circleActions.addUserTies(result));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Fetch user tieds
 */
function* dbFetchUserTieds() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            const result: Map<string, any> = yield call(userTieService.getUserTieSender, uid);
            yield put(userActions.addPeopleInfo(result));
            yield put(circleActions.addUserTieds(result));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

export default function* circleSaga() {
    yield all([
        takeLatest(CircleActionType.DB_FETCH_CIRCLES, dbFetchCircle),
        takeLatest(CircleActionType.DB_FETCH_USER_TIES, dbFetchUserTies),
        takeLatest(CircleActionType.DB_FETCH_USER_TIEDS, dbFetchUserTieds),
    ]);
}
