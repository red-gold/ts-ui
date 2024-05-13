import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Container, decorate, injectable } from 'inversify';
import { HttpService } from 'data/webAPI/services/httpService';

/**
 * Register http service dependecies
 */
export const useHttpService = (container: Container) => {
    decorate(injectable(), HttpService);
    container.bind<IHttpService>(SocialProviderTypes.HttpService).to(HttpService);
};
