import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Container } from 'inversify';
import { HttpService } from 'data/webAPI/services/httpService';

/**
 * Register http service dependecies
 */
export const useHttpService = (container: Container) => {
    container.bind<IHttpService>(SocialProviderTypes.HttpService).to(HttpService);
};
