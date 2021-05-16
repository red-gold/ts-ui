import { injectable } from 'inversify';
import { IPermissionService } from 'core/services/security/IPermissionService';
/**
 * Permission service
 */
@injectable()
export class PermissionService implements IPermissionService {
    constructor() {
        this.getIdToken = this.getIdToken.bind(this);
    }

    /**
     * Get current user id token
     */
    public getIdToken: () => Promise<string> = async () => {
        return ' Not implemented!' as any;
    };
}
