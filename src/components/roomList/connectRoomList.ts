// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map } from 'immutable';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IRoomListProps, IDispatchProps, IOwnProps, IStateProps } from './IRoomListProps';
import { withStyles } from '@material-ui/styles';
import { roomListStyles } from './roomListStyles';
import { chatSelector } from 'redux/reducers/chat/chatSelector';
import * as chatActions from 'redux/actions/chatActions';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        openRoom: (roomId: string) => dispatch(chatActions.openRoom(roomId)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectRoomList = chatSelector.selectRoomList();
    const mapStateToProps = (state: Map<string, any>) => {
        const rooms = selectRoomList(state);
        return {
            rooms,
        };
    };
    return mapStateToProps;
};

export const connectRoomList = (component: React.ComponentType<IRoomListProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(roomListStyles)(translateWrapper));
};
