import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';

import { IFindPeopleComponentProps } from './IFindPeopleComponentProps';

// - Import actions
/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        loadPeople: (page: number, limit: number) => dispatch(userActions.dbFetchFindPeople(page, limit)),
        increasePage: () => dispatch(userActions.increaseFindPagePeoplePage()),
    };
};

const makeMapStateToProps = () => {
    const selectHasMorePeople = userSelector.selectMoreFindPeople();
    const selectFindPeople = userSelector.selectFindPeople();
    const selectPage = userSelector.selectFindPeoplePage();

    const mapStateToProps = (state: Map<string, any>) => {
        const hasMorePeople = selectHasMorePeople(state);
        const info = selectFindPeople(state);
        const page = selectPage(state);
        return {
            peopleInfo: info,
            hasMorePeople,
            page,
        };
    };
    return mapStateToProps;
};

export const connectFindPeople = (component: ComponentType<IFindPeopleComponentProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
