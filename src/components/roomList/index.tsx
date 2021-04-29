import React, { Component } from 'react';
import classNames from 'classnames';
import { WithTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import List from '@material-ui/core/List';
import Popover from '@material-ui/core/Popover';
import RoomItem from 'components/roomItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import 'simplebar/dist/simplebar.min.css';

import { IRoomListProps } from './IRoomListProps';
import { IRoomListState } from './IRoomListState';

import { connectRoomList } from './connectRoomList';

export class RoomListComponent extends Component<IRoomListProps & WithTranslation, IRoomListState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IRoomListProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};
    }

    roomItemList = () => {
        const { onClose, openRoom } = this.props;
        const { rooms } = this.props;
        const parsedDOM: any[] = [];
        if (rooms) {
            rooms.forEach((room) => {
                parsedDOM.push(
                    <RoomItem
                        key={room.get('roomId')}
                        fullName={room.get('fullName', '')}
                        avatar={room.get('avatar', '')}
                        closeRoomList={onClose}
                        openRoom={openRoom}
                        room={room}
                    />,
                );
            });
        }
        return parsedDOM;
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { open, anchorEl, onClose, classes, t } = this.props;
        const noRoomList = (
            <span className={classes.noRoom}>
                <Typography variant="subtitle1" color="inherit">
                    {t('header.noRoom')}{' '}
                </Typography>
            </span>
        );
        const items = this.roomItemList();
        return (
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                PaperProps={{ className: classNames(classes.paper) }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                elevation={4}
            >
                <div className={classes.container}>
                    <div className={classes.header}>
                        <div className={classes.haederContent}>
                            <Typography variant="subtitle1" color="inherit" className={classes.title}>
                                {t('header.messengerTitle')}
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    <div className={classes.listRoot}>
                        <div className={classes.listWrapper}>
                            <SimpleBar style={{ maxHeight: 300 }}>
                                {items.length > 0 ? <List className={classes.list}>{items}</List> : noRoomList}
                            </SimpleBar>
                        </div>
                    </div>
                </div>
            </Popover>
        );
    }
}

export default connectRoomList(RoomListComponent);
