import { Map } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IContactsProps, IDispatchProps, IOwnProps, IStateProps } from './IContactsProps';
import { withStyles } from '@material-ui/core/styles';
import { contactsStyles } from './contactsStyles';
import { push } from 'connected-react-router';
import * as chatActions from 'store/actions/chatActions';
import { chatSelector } from 'store/reducers/chat/chatSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        goTo: (url: string) => dispatch(push(url)),
        openRoom: (roomId: string) => dispatch(chatActions.openRoom(roomId)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectContacts = chatSelector.selectContacts();
    const selectRoomLoaded = chatSelector.selectRoomLoaded();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const contacts = selectContacts(state);
        const contactsLoaded = selectRoomLoaded(state);
        return {
            currentUser,
            contacts,
            contactsLoaded,
        };
    };
    return mapStateToProps;
};

export const connectContacts = (component: React.ComponentType<IContactsProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(contactsStyles)(translateWrapper));
};
