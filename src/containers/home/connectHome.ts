import { Map, List as ImuList } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IHomeProps, IDispatchProps, IOwnProps, IStateProps } from './IHomeProps';
import { withStyles } from '@material-ui/core/styles';
import { homeStyles } from './homeStyles';
import { chatSelector } from 'store/reducers/chat/chatSelector';
import { globalSelector } from 'store/reducers/global/globalSelector';
import * as chatActions from 'store/actions/chatActions';
import * as globalActions from 'store/actions/globalActions';
import { push } from 'connected-react-router';

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any) => {
    return {
        openChat: () => dispatch(chatActions.openRoom('')),
        closeChat: () => dispatch(chatActions.closeChat()),
        loadData: () => dispatch(globalActions.loadInitialData()),
        defaultDataDisable: () => dispatch(globalActions.defaultDataDisable()),
        defaultDataEnable: () => dispatch(globalActions.defaultDataEnable()),
        goTo: (url: string) => dispatch(push(url)),
        showSendFeedback: () => dispatch(globalActions.showSendFeedback()),
        hideSendFeedback: () => dispatch(globalActions.hideSendFeedback()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectUserAuthStatus = authorizeSelector.selectUserAuthStatus();
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectChatOpen = chatSelector.selectChatOpen();
    const selectActiveRooms = chatSelector.selectActiveRooms();
    const selectAllDataLoaded = globalSelector.selectAllDataLoaded();

    const mapStateToProps = (state: Map<string, any>) => {
        const currentUser = selectCurrentUser(state);
        const isChatOpen: boolean = selectChatOpen(state);
        const loaded: boolean = selectAllDataLoaded(state);
        const activeRooms = selectActiveRooms(state) as ImuList<Map<string, any>>;
        const authed: boolean = selectUserAuthStatus(state);
        return {
            currentUser,
            isChatOpen,
            loaded,
            authed,
            activeRooms,
        };
    };
    return mapStateToProps;
};
export const connectHome = (component: React.ComponentType<IHomeProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(homeStyles, { withTheme: true })(translateWrapper));
};
