import { Circle } from 'core/domain/circles/circle';
import { SocialError } from 'core/domain/common/socialError';
import { ICircleService } from 'core/services/circles/ICircleService';
import { Map } from 'immutable';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';

/**
 * Firbase circle service
 */
@injectable()
export class CircleService implements ICircleService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    public addCircle = async (userId: string, circle: Circle) => {
        try {
            const payload = {
                name: circle.name,
            };
            const result = await this._httpService.post('circles', payload);
            return result.objectId;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public updateCircle = async (userId: string, circleId: string, circle: Circle) => {
        try {
            await this._httpService.put('circles', circle);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteCircle = async (userId: string, circleId: string) => {
        try {
            const deleteCircle$ = this._httpService.delete(`circles/${circleId}`);
            const deleteUserRelCircle$ = this._httpService.delete(`user-rels/circle/${circleId}`);
            await Promise.all([deleteCircle$, deleteUserRelCircle$]);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getCircles = async () => {
        try {
            const result = await this._httpService.get(`circles/my`);
            let parsedData: Map<string, Map<string, any>> = Map({});
            result.forEach((circle: any) => {
                const parsedCircle = {
                    id: circle.objectId,
                    creationDate: circle.created_date,
                    ownerId: circle.ownerUserId,
                    name: circle.name,
                    isSystem: circle.isSystem,
                };
                parsedData = parsedData.set(circle.objectId, Map(parsedCircle));
            });
            return parsedData;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
