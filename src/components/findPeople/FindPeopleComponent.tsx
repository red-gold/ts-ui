import UserBoxList from 'components/userBoxList/UserBoxListComponent';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as userActions from 'redux/actions/userActions';
import { userSelector } from 'redux/reducers/users/userSelector';
import { Map } from 'immutable';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { ServerRequestType } from 'constants/serverRequestType';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import UserBoxSkeleton from 'components/userBoxSkeleton';
import { useStyles } from './findPeopleStyles';

const selectHasMorePeople = userSelector.selectMoreFindPeople();
const selectFindPeople = userSelector.selectFindPeople();
const selectPage = userSelector.selectFindPeoplePage();
const selectRequest = serverSelector.selectRequest();
const selectCurrentUser = authorizeSelector.selectCurrentUser();

export function FindPeopleComponent() {
    const { t } = useTranslation();
    const classes = useStyles();
    // Dispatcher
    const dispatch = useDispatch();
    const loadPeople = (page: number, limit: number) => dispatch<any>(userActions.dbFetchFindPeople(page, limit));
    const increasePage = () => dispatch<any>(userActions.increaseFindPagePeoplePage());

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const currentUserId = currentUser.get('userId');
    const hasMorePeople = useSelector((state: Map<string, any>) => selectHasMorePeople(state)) as boolean;
    const peopleInfo = useSelector((state: Map<string, any>) => selectFindPeople(state));
    const page = useSelector((state: Map<string, any>) => selectPage(state));
    const requestId = StringAPI.createServerRequestId(ServerRequestType.UserFetchRequest, currentUserId);
    const findRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId })) as Map<string,any>;
    const findRequestStatus: ServerRequestStatusType = findRequest.get('status', ServerRequestStatusType.NoAction);

    /**
     * Load more
     */
    const loadMore = () => {
        if (page !== undefined) {
            loadPeople(page, 10);
            increasePage();
        }
    };

    const loading = findRequestStatus === ServerRequestStatusType.Sent;
    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMorePeople,
        onLoadMore: loadMore,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: false,
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    });

    return (
        <div>
            <div className="profile__title">{t('people.suggestionsForYouLabel')}</div>
            {peopleInfo && peopleInfo.count() > 0 ? (
                <div>
                    <UserBoxList users={peopleInfo} />
                    <div style={{ height: '24px' }} />
                </div>
            ) : (
                <div className="g__title-center">{t('people.nothingToShowLabel')}</div>
            )}

            {(loading || hasMorePeople) && (
                <div ref={sentryRef} className={classes.skeletonRoot}>
                    <UserBoxSkeleton />
                </div>
            )}
        </div>
    );
}

export default FindPeopleComponent;
