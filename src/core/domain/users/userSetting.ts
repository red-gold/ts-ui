import { BaseDomain } from 'core/domain/common'
import { UserSettingItem } from './userSettingItem';

export class UserSetting extends BaseDomain {

    constructor (
        public type: string,
        public creationDate: number,
        public ownerUserId: string,
        public list: UserSettingItem[]
        
      ) {
        super()
    
      }

}
