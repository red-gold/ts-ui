import { UserTie } from 'core/domain/circles/userTie';
import { SocialError } from 'core/domain/common/socialError';
import { IUserTieService } from 'core/services/circles/IUserTieService';
import { List, Map } from 'immutable';
import { inject, injectable } from 'inversify';

import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { throwNoValue } from 'utils/errorHandling';

/**
 * Firbase user service
 */
@injectable()
export class UserTieService implements IUserTieService {
    @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService;
    // eslint-disable-next-line
    constructor() {}

    /**
     * Tie users
     */
    public tieUseres = async (userTieSenderInfo: UserTie, userTieReceiveInfo: UserTie, circleIds: string[]) => {
        try {
            const leftUser = {
                userId: userTieSenderInfo.userId,
                fullName: userTieSenderInfo.fullName,
                avatar: userTieSenderInfo.avatar,
            };

            const rightUser = {
                userId: userTieReceiveInfo.userId,
                fullName: userTieReceiveInfo.fullName,
                avatar: userTieReceiveInfo.avatar,
            };

            const payload = {
                left: leftUser,
                right: rightUser,
                rel: [userTieReceiveInfo.userId, userTieSenderInfo.userId],
                circleIds: circleIds,
            };

            const result = await this._httpService.post('user-rels/follow', payload);
            return result.objectId;
        } catch (error) {
            throw new SocialError(error.code, 'service/tieUseres :' + error.message);
        }
    };

    /**
     * Update users tie
     */
    public updateUsersTie = async (userTieSenderInfo: UserTie, userTieReceiveInfo: UserTie, circleIds: string[]) => {
        try {
            const payload = {
                circleIds: circleIds,
                rightId: userTieReceiveInfo.userId,
            };
            await this._httpService.put('user-rels/circles', payload);
        } catch (error) {
            throw new SocialError(error.code, 'service/updateUsersTie :' + error.message);
        }
    };

    /**
     * Remove users' tie
     */
    public removeUsersTie = async (firstUserId: string, secondUserId: string) => {
        try {
            await this._httpService.delete(`user-rels/unfollow/${secondUserId}`);
        } catch (error) {
            throw new SocialError(error.code, 'service/removeUsersTie :' + error.message);
        }
    };

    /**
     * Get user ties who current user followd
     */
    public getUserTies = async () => {
        try {
            const result = await this._httpService.get(`user-rels/following`);
            let parsedData: Map<string, any> = Map({});
            if (!(result && result.length > 0)) {
                return parsedData;
            }
            result.forEach((rel: any) => {
                const creationDate = rel['created_date'];
                const circleIdList = rel.circleIds;
                const { userId, fullName, avatar } = rel.right;
                const rightUserInfo: UserTie = new UserTie(userId, creationDate, fullName, avatar, true, circleIdList);
                const rightUserID = throwNoValue(rightUserInfo.userId, 'rightUserInfo.userId');
                parsedData = parsedData.set(
                    rightUserID,
                    Map({
                        ...rightUserInfo,
                        circleIdList: circleIdList ? List(circleIdList) : List([]),
                    }),
                );
            });
            return parsedData;
        } catch (error) {
            throw new SocialError(error.code, 'service/getUserTies :' + error.message);
        }
    };

    /**
     * Get the users who tied current user
     */
    public getUserTieSender = async () => {
        try {
            const result = await this._httpService.get(`user-rels/followers`);
            let parsedData: Map<string, any> = Map({});
            if (!(result && result.length > 0)) {
                return parsedData;
            }
            result.forEach((rel: any) => {
                const creationDate = rel['created_date'];
                const circleIdList = rel.circleIds;
                const { userId, fullName, avatar } = rel.left;
                const leftUserInfo: UserTie = new UserTie(userId, creationDate, fullName, avatar, true, circleIdList);
                const leftUserID = throwNoValue(leftUserInfo.userId, 'leftUserInfo.userId');

                parsedData = parsedData.set(
                    leftUserID,
                    Map({
                        ...leftUserInfo,
                        circleIdList: List([]),
                    }),
                );
            });
            return parsedData;
        } catch (error) {
            throw new SocialError(error.code, 'service/getUserTieSender :' + error.message);
        }
    };
}
