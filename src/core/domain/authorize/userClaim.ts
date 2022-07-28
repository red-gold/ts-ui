export class UserClaim {
    constructor() {
        this.isAnonymous = false;
        this.metadata = null;
        this.phoneNumber = null;
        this.providerData = 'telar';
        this.refreshToken = null;
    }

    public displayName: string;

    public email: string;

    public emailVerified: boolean;

    public isAnonymous?: boolean;

    public metadata?: any | null;

    public phoneNumber?: string | null;

    public avatar: string;

    public providerData?: any | null;

    public providerId: any;

    public refreshToken?: string | null;

    public uid: string;

    public phoneVerified: boolean;
}
