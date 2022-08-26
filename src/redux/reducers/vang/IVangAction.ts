import { VangActionType } from 'constants/vangActionType';

/**
 *  Vang action interface
 */
export interface IVangAction {
    payload: any;
    type: VangActionType;
}
