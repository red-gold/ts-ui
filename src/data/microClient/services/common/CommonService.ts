import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommonService } from 'core/services/common/ICommonService';
/**
 * Firbase comment service
 */

export class CommonService implements ICommonService {
    private _httpService: IHttpService;

    constructor(httpService: IHttpService) {
        this._httpService = httpService;
    }

    /**
     * Get twitter media
     */
    getTwitterMedia = async () => {
        return 'Not implementd!' as any;
    };

    /**
     * Post feedback
     */
    addFeed = async () => {
        return 'Not implementd!' as any;
    };
}
