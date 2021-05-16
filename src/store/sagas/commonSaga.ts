import { GlobalActionType } from 'constants/globalActionType';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as circleActions from 'store/actions/circleActions';
import * as commentActions from 'store/actions/commentActions';
import * as globalActions from 'store/actions/globalActions';
import * as imageGalleryActions from 'store/actions/imageGalleryActions';
import * as notifyActions from 'store/actions/notifyActions';
import * as postActions from 'store/actions/postActions';
import * as userActions from 'store/actions/userActions';
import * as userSettingActions from 'store/actions/userSettingActions';
import * as voteActions from 'store/actions/voteActions';
import * as chatActions from '../actions/chatActions';

/***************************** Subroutines ************************************/

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
function* loadInitialData() {
    yield put(userSettingActions.dbFetchUserSetting());
    yield put(userActions.dbGetUserInfo());
    yield put(notifyActions.dbGetNotifications());
    yield put(circleActions.dbGetCircles());
    yield put(circleActions.dbGetUserTies());
    yield put(circleActions.dbGetFollowers());
    yield put(chatActions.wsConnect());
}

export default function* commonSaga() {
    yield all([
        takeLatest(GlobalActionType.CLEAR_LOADED_DATA, clearLoadedData),
        takeLatest(GlobalActionType.LOAD_INITIAL_DATA, loadInitialData),
    ]);
}
