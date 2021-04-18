import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';

import { IDispatchProps, IOwnProps, ISearchUserProps, IStateProps } from './ISearchUserProps';

// - Import actions
/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        search: (query: string, page: number, limit: number) =>
            dispatch(userActions.fetchUserSearch(query, page, limit)),
    };
};

const makeMapStateToProps = () => {
    const selectHasMorePeople = userSelector.selectMoreSearchPeople();
    const selectFindPeople = userSelector.selectSearchPeople();

    const mapStateToProps = (state: Map<string, any>) => {
        const hasMorePeople = selectHasMorePeople(state);
        const info = selectFindPeople(state);

        return {
            peopleInfo: info,
            hasMorePeople,
        };
    };
    return mapStateToProps;
};

export const connectSearchUser = (component: ComponentType<ISearchUserProps>) =>
    connect<IStateProps, IDispatchProps, IOwnProps, any>(makeMapStateToProps, mapDispatchToProps)(component);
