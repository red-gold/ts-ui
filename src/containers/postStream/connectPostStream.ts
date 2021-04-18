import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { log } from 'utils/log';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { globalSelector } from 'store/reducers/global/globalSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';

import { IPostStreamProps } from './IPostStreamProps';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectProgress = globalSelector.selectProgress();
    const selectRequest = serverSelector.selectRequest();

    const mapStateToProps = (state: Map<string, any>, ownProps: IPostStreamProps) => {
        const currentUser = selectCurrentUser(state);
        if (!ownProps.requestId) {
            log.error('ownProps.requestId is null');
            return;
        }
        const streamRequestReq = selectRequest(state, { requestId: ownProps.requestId });
        const progress = selectProgress(state);
        return {
            streamRequestStatus: streamRequestReq.get('status', ServerRequestStatusType.NoAction),
            avatar: currentUser.get('avatar', ''),
            fullName: currentUser.get('fullName'),
            progress,
        };
    };
    return mapStateToProps;
};

export const connectPostStream = (component: ComponentType<IPostStreamProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
