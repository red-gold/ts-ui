import { UserPermissionType } from 'core/domain/common/userPermissionType';

export class Media {
    constructor(
        public objectId: string,
        public deletedDate: number,
        public created_date: number,
        public thumbnail: string,
        public url: string,
        public fullPath: string,
        public caption: string,
        public directory: string,
        public fileName: string,
        public ownerUserId: string,
        public last_updated: number,
        public albumId: string,
        public height: number = 0,
        public width: number = 0,
        public meta: string = '',
        public deleted: boolean = false,
        public accessUserList: Array<string> = [],
        public permission:  UserPermissionType = UserPermissionType.Public,
    ) {
        
    }
}