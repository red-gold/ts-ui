// - Import react components
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import UserBoxList from 'components/userBoxList/UserBoxListComponent';
import LoadMoreProgressComponent from 'layouts/loadMoreProgress';
import queryString from 'query-string';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router-dom';
import { defaultNoValue } from 'utils/errorHandling';
import { Map } from 'immutable';

import SearchComponent from '../search';
import { connectSearchUser } from './connectSearchUser';
import { ISearchUserProps } from './ISearchUserProps';
import { ISearchUserState } from './ISearchUserState';
import { searchUserStyles } from './searchUserStyles';

// - Material UI
// - Import app components
// - Import API

// - Import actions
/**
 * Create component class
 */
export class SearchUserComponent extends Component<ISearchUserProps & WithTranslation, ISearchUserState> {
    /**
     * Fields
     */
    unlisten: any;
    nextPage = 0;

    /**
     * Component constructor
     *
     */
    constructor(props: ISearchUserProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    searchQuery() {
        const { location } = this.props;
        this.executeSearch(location);
    }

    executeSearch(location: any) {
        const { search } = this.props;
        const params: { q: string } = queryString.parse(location.search) as any;
        search(params.q, this.nextPage, 10);
        this.nextPage++;
    }

    searchParam = () => {
        const params: { q: string } = queryString.parse(window.location.search) as any;
        return params.q;
    };

    componentDidMount() {
        const { history } = this.props;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const scope = this;
        this.unlisten = history.listen((location: any) => {
            scope.nextPage = 0;
            this.executeSearch(location);
        });
        this.searchQuery();
    }

    componentWillUnmount() {
        this.unlisten();
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { hasMorePeople, t, classes } = this.props;
        const peopleInfo = defaultNoValue(this.props.peopleInfo, Map({}));
        if (!t) {
            return <div />;
        }
        return (
            <SearchComponent tab="people">
                <InfiniteScroll
                    dataLength={peopleInfo ? peopleInfo.count() : 0}
                    next={this.searchQuery}
                    hasMore={defaultNoValue(hasMorePeople, true)}
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
                        {t('search.notFoundUser', { query: this.searchParam() })}
                    </Typography>
                </div>
            </SearchComponent>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SearchUserComponent);

export default withRouter<any, any>(
    connectSearchUser(withStyles(searchUserStyles as any)(translateWrapper as any) as any),
);
