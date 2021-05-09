import { Map } from 'immutable';

export type IConfigProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    classes?: any;
    currentLanguage?: string;
}

export interface IStateProps {
    userSetting: Map<string, any>;
}

export interface IDispatchProps {
    updateUserSetting: (type: string, setting: object) => any;
    getUserSetting: () => any;
}
