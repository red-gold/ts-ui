import { Map } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IPeopleBoxProps, IDispatchProps, IOwnProps, IStateProps } from './IPeopleBoxProps';
import { withStyles } from '@material-ui/core/styles';
import { peopleBoxStyles } from './peopleBoxStyles';
import { push } from 'connected-react-router';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        goTo: (url: string) => dispatch(push(url)),
        fetchUserSuggestions: () => dispatch(userActions.fetchUserSuggestions()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectUserSuggestions = userSelector.selectUserSuggestions();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const userSuggestions = selectUserSuggestions(state);
        return {
            currentUser,
            userSuggestions,
        };
    };
    return mapStateToProps;
};

export const connectPeopleBox = (component: React.ComponentType<IPeopleBoxProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(peopleBoxStyles)(translateWrapper));
};
