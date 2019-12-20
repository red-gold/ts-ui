// - Import react components

import { injectable, inject } from 'inversify';
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommonService } from 'core/services/common/ICommonService';
import { Feed } from 'core/domain/common/feed';

/**
 * Firbase comment service
 */
@injectable()
export class CommonService implements ICommonService {
  @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService

   /**
   * Get twitter media
   */
  getTwitterMedia = async (accessToken: string) => {
    return 'Not implementd!' as any
  }
  /**
   * Post feedback
   */
  addFeed = async (feed: Feed) => {
    return 'Not implementd!' as any
  }

}
