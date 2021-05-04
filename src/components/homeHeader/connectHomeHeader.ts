// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IHomeHeaderProps, IDispatchProps, IOwnProps, IStateProps } from './IHomeHeaderProps';
import { withStyles } from '@material-ui/core/styles';
import { notificationSelector } from 'store/reducers/notifications/notificationSelector';
import { push } from 'connected-react-router';
import * as authorizeActions from 'store/actions/authorizeActions';
import * as userActions from 'store/actions/userActions';
import { homeHeaderStyles } from './homeHeaderStyles';
import withWidth from '@material-ui/core/withWidth/withWidth';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { globalSelector } from 'store/reducers/global/globalSelector';
import { userSelector } from 'store/reducers/users/userSelector';
import { chatSelector } from 'store/reducers/chat/chatSelector';
import { withRouter } from 'react-router';
import { DialogType } from 'models/common/dialogType';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        logout: () => dispatch(authorizeActions.dbLogout()),
        goTo: (url: string) => dispatch(push(url)),
        openEditor: () => dispatch(userActions.openEditProfile()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectNotificationsCount = notificationSelector.selectNotificationsCount();
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectHeaderTitle = globalSelector.selectHeaderTitle();
    const selectOpenEditProfile = userSelector.selectOpenEditProfile();
    const selectUnreadRoomsCount = chatSelector.selectUnreadRoomsCount();
    const selectDialogState = globalSelector.selectDialogState();

    const mapStateToProps = (state: Map<string, any>) => {
        const notifyCount = selectNotificationsCount(state);
        const user = selectCurrentUser(state);
        const title = selectHeaderTitle(state);
        const myProfileAccountOpen = selectOpenEditProfile(state);
        const unreadRoomsCount = selectUnreadRoomsCount(state);
        const postWriteOpen = selectDialogState(state, { type: DialogType.PostWrite });

        return {
            avatar: user.get('avatar', ''),
            fullName: user.get('fullName', ''),
            banner: user.get('banner', ''),
            title,
            notifyCount,
            myProfileAccountOpen,
            unreadRoomsCount,
            postWriteOpen,
        };
    };
    return mapStateToProps;
};

export const connectHomeHeader = (component: React.ComponentType<IHomeHeaderProps & WithTranslation>) => {
    const translateWrapper = withWidth()(withTranslation('translations')(component));
    const connectWrapper = connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(homeHeaderStyles, { withTheme: true })(translateWrapper));
    return withRouter<any, any>(connectWrapper);
};
