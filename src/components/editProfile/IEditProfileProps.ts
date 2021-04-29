import { Map, List } from 'immutable';
import { User } from 'core/domain/users/user';

export type IEditProfileProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    fullName: string;
    avatar: string;
    banner: string;
    classes?: any;
    currentLanguage?: string;
}

export interface IStateProps {
    currentUser: Map<string, any>;
    open: boolean;
    avatarImages: List<Map<string, any>>;
    coverImages: List<Map<string, any>>;
}

export interface IDispatchProps {
    update: (profile: User) => void;
    loadAvatarList: (userId: string) => any;
    loadCoverList: (userId: string) => any;
    onRequestClose: () => void;
}
