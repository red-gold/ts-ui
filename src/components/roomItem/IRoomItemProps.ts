import { Map } from 'immutable';

export interface IRoomItemProps {
    fullName: string;

    avatar: string;

    room: Map<string, any>;

    closeRoomList: () => void;

    openRoom: (roomId: string) => any;

    /**
     * Material ui styles
     */
    classes?: any;
}
