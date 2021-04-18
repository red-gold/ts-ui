import { Map, List as ImuList } from 'immutable';

export type IRoomListProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Close notification
     */
    onClose: () => void;

    /**
     * User notifications popover is opem {true} or not {false}
     */
    open: boolean;

    /**
     * Keep element
     */
    anchorEl?: any;

    /**
     * Material ui styles
     */
    classes?: any;
}

export interface IStateProps {
    rooms: ImuList<Map<string, any>>;
}

export interface IDispatchProps {
    openRoom: (roomId: string) => any;
}
