import UserBoxList from 'components/userBoxList/UserBoxListComponent';
import LoadMoreProgressComponent from 'layouts/loadMoreProgress';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { throwNoValue } from 'utils/errorHandling';

import { connectFindPeople } from './connectFindPeople';
import { IFindPeopleComponentProps } from './IFindPeopleComponentProps';
import { IFindPeopleComponentState } from './IFindPeopleComponentState';

export class FindPeopleComponent extends Component<
    IFindPeopleComponentProps & WithTranslation,
    IFindPeopleComponentState
> {
    /**
     * Fields
     */
    nextPage = 0;

    /**
     * Component constructor
     *
     */
    constructor(props: IFindPeopleComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    /**
     * Scroll loader
     */
    scrollLoad = () => {
        const { loadPeople, page, increasePage } = this.props;
        if (loadPeople && page !== undefined && loadPeople && increasePage) {
            loadPeople(page, 10);
            increasePage();
        }
    };

    componentDidMount() {
        this.scrollLoad();
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { hasMorePeople, t } = this.props;
        const peopleInfo = throwNoValue(this.props.peopleInfo, 'this.props.peopleInfo');
        if (!t) {
            return <div />;
        }
        return (
            <div>
                <InfiniteScroll
                    dataLength={peopleInfo ? peopleInfo.count() : 0}
                    next={this.scrollLoad}
                    hasMore={hasMorePeople || false}
                    endMessage={<p style={{ textAlign: 'center' }}></p>}
                    loader={<LoadMoreProgressComponent key="find-people-load-more-progress" />}
                >
                    <div className="tracks">
                        {peopleInfo && peopleInfo.count() > 0 ? (
                            <div>
                                <div className="profile__title">{t('people.suggestionsForYouLabel')}</div>
                                <UserBoxList users={peopleInfo} />
                                <div style={{ height: '24px' }}></div>
                            </div>
                        ) : (
                            <div className="g__title-center">{t('people.nothingToShowLabel')}</div>
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(FindPeopleComponent);

export default connectFindPeople(translateWrapper as any);
