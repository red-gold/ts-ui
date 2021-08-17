import { UserAPI } from 'api/UserAPI';
import { UserActionType } from 'constants/userActionType';
import { User } from 'core/domain/users/user';
import { IUserService } from 'core/services/users/IUserService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { call, all, select, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as globalActions from 'redux/actions/globalActions';
import * as serverActions from 'redux/actions/serverActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import * as userActions from 'redux/actions/userActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { circleSelector } from 'redux/reducers/circles/circleSelector';
import { dispatch } from 'use-bus';
import { implementPromiseAction } from '@adobe/redux-saga-promise';

/**
 * Get service providers
 */
const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

/***************************** Subroutines ************************************/

/**
 * Fetch user profile
 */
function* dbFetchUserProfile() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            const userProfile: User = yield call(userService.getCurrentUserProfile);
            yield put(userActions.addUserInfo(uid, Map({ ...userProfile, userId: uid })));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

function* fetchProfileById(action: { type: UserActionType; payload: any }) {
    yield call(implementPromiseAction, action, function* () {
        const { uid } = action.payload;

        try {
            const userProfile: User = yield call(userService.getUserProfile, uid);

            yield put(userActions.addUserInfo(uid, Map({ ...userProfile, userId: uid })));
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    });
}

function* fetchProfileBySocialName(action: { type: UserActionType; payload: any }) {
    yield call(implementPromiseAction, action, function* () {
        const { socialName } = action.payload;
        if (socialName) {
            try {
                const userProfile: Record<string, any> = yield call(userService.getProfileBySocialName, socialName);

                yield put(
                    userActions.addUserInfo(
                        userProfile.objectId,
                        Map({ ...userProfile, userId: userProfile.objectId }),
                    ),
                );
            } catch (error) {
                yield put(globalActions.showMessage(error.message));
                throw error;
            }
        }
    });
}

function* getUserProfilePage(action: { type: UserActionType; payload: any }) {
    const { uid } = action.payload;
    if (uid) {
        try {
            const userProfile: User = yield call(userService.getUserProfile, uid);

            yield put(userActions.addUserInfo(uid, Map({ ...userProfile, userId: uid })));
        } catch (error) {
            dispatch({ type: '@@ui/navigate', payload: { url: '/404' } });
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Fetch users for search
 */
function* dbSearchUser(userId: string, query: string, page: number, limit: number) {
    const followingUsers: Map<string, any> = yield select(circleSelector.getFollowingUsers);
    const followingIds = followingUsers
        .keySeq()
        .map((key) => `userId:${key}`)
        .toArray();
    followingIds.push(`userId:${userId}`);
    yield put(globalActions.showTopLoading());
    try {
        const apiResult: { users: Map<string, any>; ids: Map<string, boolean>; hasMore: boolean } = yield call(
            userService.searchUser,
            query,
            `NOT userId:${userId}`,
            page,
            limit,
            [],
        );

        if (!apiResult.hasMore) {
            yield put(userActions.notMoreSearchPeople());
        }
        const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
        const searchUserRequest = UserAPI.createUserSearchRequest(authedUser.get('uid'));
        searchUserRequest.status = ServerRequestStatusType.OK;
        yield put(serverActions.sendRequest(searchUserRequest));

        yield put(userActions.addPeopleInfo(apiResult.users));
        yield put(userActions.addUserSearch(apiResult.ids, page === 0));
    } catch (error) {
        yield put(globalActions.showMessage(error.message));
        yield put(userActions.notMoreSearchPeople());
    } finally {
        yield put(globalActions.hideTopLoading());
    }
}

/**
 * Fetch users for finding people
 */
function* dbFindPeopls(userId: string, query: string, page: number, limit: number) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');

    const apiResult: { users: Map<string, any>; ids: Map<string, boolean>; hasMore: boolean } = yield call(
        userService.searchUser,
        query,
        userId,
        page,
        limit,
        [],
    );

    if (!apiResult.hasMore) {
        yield put(userActions.notMoreFindPeople());
    }

    const searchUserRequest = UserAPI.createUserSearchRequest(uid);
    searchUserRequest.status = ServerRequestStatusType.OK;
    yield put(serverActions.sendRequest(searchUserRequest));

    yield put(userActions.addPeopleInfo(apiResult.users));
    yield put(userActions.addFindPeople(apiResult.ids));
}

/**
 * Fetch user suggestions
 */
function* fetchUserSuggestions() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);

    const uid = authedUser.get('uid');
    const searchUserRequest = UserAPI.createUserFetchSuggestions();
    yield put(serverActions.sendRequest(searchUserRequest));
    const followingUsers: Map<string, any> = yield select(circleSelector.getFollowingUsers);
    const followingIds = followingUsers.keySeq().toArray();
    try {
        const apiResult: { users: Map<string, any>; ids: Map<string, boolean>; hasMore: boolean } = yield call(
            userService.searchUser,
            '',
            uid,
            0,
            6,
            followingIds,
        );
        yield put(userActions.addPeopleInfo(apiResult.users));
        yield put(userActions.addUserSuggestions(apiResult.ids, true));

        searchUserRequest.status = ServerRequestStatusType.OK;
        yield put(serverActions.sendRequest(searchUserRequest));
    } catch (error) {
        searchUserRequest.status = ServerRequestStatusType.Error;
        yield put(serverActions.sendRequest(searchUserRequest));
        yield put(globalActions.showMessage(error.message));
    }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

/**
 * Watch find people
 */
function* watchFindPeople(action: { type: UserActionType; payload: any }) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const streamServerRequest = UserAPI.createUserSearchRequest(authedUser.get('uid'));
    yield put(serverActions.sendRequest(streamServerRequest));
    const { payload } = action;
    const { page, limit } = payload;
    const uid = authedUser.get('uid');
    try {
        yield call(dbFindPeopls, uid, '', page, limit);
    } catch (error) {
        streamServerRequest.status = ServerRequestStatusType.Error;
        yield put(serverActions.sendRequest(streamServerRequest));
        yield put(globalActions.showMessage(error.message));
        yield put(userActions.notMoreFindPeople());
    }
}

/**
 * Watch search user
 */
function* watchSearchUser(action: { type: UserActionType; payload: any }) {
    yield call(implementPromiseAction, action, function* () {
        const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
        const streamServerRequest = UserAPI.createUserSearchRequest(authedUser.get('uid'));
        yield put(serverActions.sendRequest(streamServerRequest));
        const { payload } = action;
        const { query, page, limit } = payload;
        const uid = authedUser.get('uid');
        try {
            if (uid) {
                yield call(dbSearchUser, uid, query, page, limit);
            }
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
            yield put(userActions.notMoreSearchPeople());
            throw error;
        }
    });
}

/**
 * Watch set user entities
 */
function* watchSetUserEntities(action: { type: UserActionType; payload: any }) {
    const users: Map<string, Map<string, any>> = fromJS(action.payload.users);
    yield put(userActions.addPeopleInfo(users));
}

export default function* userSaga() {
    yield all([
        takeEvery(userActions.fetchUserSearch, watchSearchUser),
        takeEvery(UserActionType.SET_USER_ENTITIES, watchSetUserEntities),
        takeEvery(UserActionType.DB_FETCH_USER_SUGGESTIONS, fetchUserSuggestions),
        takeEvery(UserActionType.DB_FETCH_FIND_PEOPLE, watchFindPeople),
        takeLatest(UserActionType.DB_FETCH_USER_PROFILE, dbFetchUserProfile),
        takeLatest(userActions.fetchProfileById, fetchProfileById),
        takeLatest(userActions.fetchProfileBySocialName, fetchProfileBySocialName),
        takeLatest(UserActionType.GET_USER_PROFILE_PAGE, getUserProfilePage),
    ]);
}
