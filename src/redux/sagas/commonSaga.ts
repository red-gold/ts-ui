import { GlobalActionType } from 'constants/globalActionType';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as circleActions from 'redux/actions/circleActions';
import * as commentActions from 'redux/actions/commentActions';
import * as globalActions from 'redux/actions/globalActions';
import * as imageGalleryActions from 'redux/actions/imageGalleryActions';
import * as notifyActions from 'redux/actions/notifyActions';
import * as postActions from 'redux/actions/postActions';
import * as userActions from 'redux/actions/userActions';
import * as userSettingActions from 'redux/actions/userSettingActions';
import * as voteActions from 'redux/actions/voteActions';
import { implementPromiseAction } from '@adobe/redux-saga-promise';

/** *************************** Subroutines *********************************** */

/**
 * Clear loaded data
 */
function* clearLoadedData() {
    yield put(imageGalleryActions.clearAllData());
    yield put(postActions.clearAllData());
    yield put(userActions.clearAllData());
    yield put(commentActions.clearAllData());
    yield put(voteActions.clearAllvotes());
    yield put(notifyActions.clearAllNotifications());
    yield put(circleActions.clearAllCircles());
    yield put(globalActions.clearTemp());
}

/**
 * Clear loaded data
 */
function* loadInitialData(action: any) {
    yield call(implementPromiseAction, action, function* () {
        yield put(userSettingActions.dbFetchUserSetting());
        yield put(notifyActions.dbGetNotifications());
        yield put(circleActions.dbGetCircles());
        yield put(circleActions.dbGetUserTies());
        yield put(circleActions.dbGetFollowers());
    });
}

export default function* commonSaga() {
    yield all([
        takeLatest(GlobalActionType.CLEAR_LOADED_DATA, clearLoadedData),
        takeLatest(globalActions.loadInitialData, loadInitialData),
    ]);
}
