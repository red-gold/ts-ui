import { BaseDomain } from 'core/domain/common'

export class UserSettingItem extends BaseDomain {

    constructor (
      public objectId: string,
      public name: string,
      public value: string,
      public isSystem: boolean,
        
      ) {
        super()
    
      }

}
