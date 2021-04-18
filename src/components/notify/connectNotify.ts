// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { INotifyProps, IDispatchProps, IOwnProps, IStateProps } from './INotifyProps';
import { withStyles } from '@material-ui/core/styles';
import { notifyStyles } from './notifyStyles';
import { notificationSelector } from 'store/reducers/notifications/notificationSelector';
import { push } from 'connected-react-router';
import * as notifyActions from 'store/actions/notifyActions';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        goTo: (url: string) => dispatch(push(url)),
        seenNotify: (id: string) => dispatch(notifyActions.dbSeenNotification(id)),
        deleteNotify: (id: string) => dispatch(notifyActions.dbDeleteNotification(id)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectNotifications = notificationSelector.selectNotifications();
    const mapStateToProps = (state: Map<string, any>) => {
        const notifications = selectNotifications(state);
        return {
            notifications,
        };
    };
    return mapStateToProps;
};

export const connectNotify = (component: React.ComponentType<INotifyProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(notifyStyles)(translateWrapper));
};
