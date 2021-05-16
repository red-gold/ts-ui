import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import UserBoxList from 'components/userBoxList/UserBoxListComponent';
import LoadMoreProgressComponent from 'layouts/loadMoreProgress';
import queryString from 'query-string';
import React from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SearchComponent from '../search';
import { useStyles } from './searchUserStyles';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';
import { Map } from 'immutable';

const selectHasMorePeople = userSelector.selectMoreSearchPeople();
const selectFindPeople = userSelector.selectSearchPeople();
export function SearchUserComponent() {
    const [currentPage, setCurrentPage] = React.useState(0);
    const location = useLocation();
    const { t } = useTranslation();
    const classes = useStyles();

    // Dispatcher
    const dispatch = useDispatch();
    const search = (query: string, page: number, limit: number) =>
        dispatch(userActions.fetchUserSearch(query, page, limit));

    // Selectors
    const hasMorePeople = useSelector((state: Map<string, any>) => selectHasMorePeople(state));
    const peopleInfo = useSelector((state: Map<string, any>) => selectFindPeople(state));

    const searchQuery = () => {
        executeSearch(location);
    };

    const executeSearch = (location: any, page?: number) => {
        const params: { q: string } = queryString.parse(location.search) as any;
        const pageNumber = page === undefined ? currentPage : page;
        search(params.q, pageNumber, 10);
        setCurrentPage(pageNumber + 1);
    };

    const searchParam = () => {
        const params: { q: string } = queryString.parse(location.search) as any;
        return params.q;
    };

    React.useEffect(() => {
        executeSearch(location, 0);
    }, [location]);

    return (
        <SearchComponent tab="people">
            <InfiniteScroll
                dataLength={peopleInfo ? peopleInfo.count() : 0}
                next={searchQuery}
                hasMore={hasMorePeople}
                endMessage={<p style={{ textAlign: 'center' }}></p>}
                loader={<LoadMoreProgressComponent key="find-people-load-more-progress" />}
            >
                <div className="tracks">
                    {peopleInfo && peopleInfo.count() > 0 ? (
                        <div>
                            <UserBoxList users={peopleInfo} />
                            <div style={{ height: '24px' }}></div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </InfiniteScroll>
            <div className={classNames({ [classes.noDisplay]: !peopleInfo.isEmpty() })}>
                <Typography className={classes.notFound}>
                    {t('search.notFoundUser', { query: searchParam() })}
                </Typography>
            </div>
        </SearchComponent>
    );
}

export default SearchUserComponent;
