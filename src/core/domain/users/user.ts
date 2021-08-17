import { BaseDomain } from 'core/domain/common/baseDomain';
import { UserPermissionType } from 'core/domain/common/userPermissionType';

export class User extends BaseDomain {
    constructor(
        public avatar?: string,
        public fullName?: string,
        public socialName?: string,
        public banner?: string,
        public tagLine?: string,
        public creationDate?: number,
        public email?: string | null,
        public birthday?: number,
        public webUrl?: string,
        public companyName?: string,
        public country?: string,
        public school?: string,
        public address?: string,
        public location?: string,
        public phone?: number,
        public voteCount?: number,
        public shareCount?: number,
        public followCount?: number,
        public followerCount?: number,
        public postCount?: number,
        public userId?: string,
        public twitterId?: string,
        public facebookId?: string,
        public instagramId?: string,
        public linkedInId?: string,
        public accessUserList?: Array<string>,
        public permission?: UserPermissionType,
    ) {
        super();
    }
}
