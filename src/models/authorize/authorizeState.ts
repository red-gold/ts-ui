export class AuthorizeState {
    constructor(
        public uid: string,
        public emailVerified: boolean,
        public providerId: string = '',
        public displayName: string = '',
        public email: string = '',
        public avatarURL: string = '',
        public phoneVerified: boolean = false,
        public authed: boolean = true,
        public guest: boolean = false,
    ) {}
}
