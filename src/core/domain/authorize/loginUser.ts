import { BaseDomain } from 'core/domain/common/baseDomain';

export class LoginUser extends BaseDomain {
    constructor(
        public objectId: string,
        public emailVerified: boolean,
        public providerId: string = '',
        public fullName: string = '',
        public phone: string = '',
        public tagLine: string = '',
        public email: string = '',
        public avatar: string = '',
        public phoneVerified: boolean = false,
        public authed: boolean = true,
        public guest: boolean = false,
    ) {
        super();
    }
}
