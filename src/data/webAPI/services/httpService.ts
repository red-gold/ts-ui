import { IHttpService } from 'core/services/webAPI/IHttpService';
import { injectable } from 'inversify';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { inject } from 'inversify';
import config from 'config';
import axios from 'axios';
import { IPermissionService } from 'core/services/security/IPermissionService';
import { SocialError } from 'core/domain/common/socialError';
import { log } from 'utils/log';

@injectable()
export class HttpService implements IHttpService {
    @inject(SocialProviderTypes.PermissionService) private _permissionService: IPermissionService;

    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    /**
     * Http GET
     */
    public async get(url: string) {
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        const result = await axios.get(requestURL);
        return result.data;
    }

    /**
     * Http POST
     */
    public async post(url: string, payload?: any) {
        const validURL = config.rewrites[url] || url;
        const result = await axios.post(`${config.gateway.gateway_uri}/${validURL}`, payload);
        return result.data;
    }

    /**
     * Http POST File
     */
    public async postFile(
        url: string,
        payload: any,
        fileName: string,
        onProgress: (percentage: number, status: boolean, fileName: string, meta?: any) => void,
    ) {
        const validURL = config.rewrites[url] || url;
        const reqConfig = {
            onUploadProgress: function (progressEvent: any) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted, true, fileName);
            },
        };

        try {
            const result = await axios.post(`${config.gateway.gateway_uri}/${validURL}`, payload, reqConfig);
            return result.data;
        } catch (error) {
            log.error(error);
            const errorData = new SocialError('HttpService/WrongSetting', 'Error happened!');

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                log.error(error.response.data);
                log.error(error.response.status);
                log.error(error.response.headers);
                const { data } = error.response;
                if (data.isError) {
                    errorData.code = data.code;
                    errorData.message = data.message;
                } else if (error.response.status == 413) {
                    errorData.code = 'HttpService/LargeFile';
                    errorData.message = `The file is too large.`;
                } else {
                    errorData.code = 'HttpService/PostFile/Error';
                    errorData.message = `The request was made and the server responded with a status code that falls out of the range of 2xx`;
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                log.error(error.request);

                errorData.code = 'HttpService/NoResponse';
                errorData.message = `
            The request was made but no response was received
            error.request is an instance of XMLHttpRequest in the browser and an instance of
            http.ClientRequest in node.js
            `;
            } else {
                // Something happened in setting up the request that triggered an Error
                log.error('Error', error.message);
                errorData.code = 'HttpService/PostFile/Unexpected';
                errorData.message = `
            Something happened in setting up the request that triggered an Error
            `;
            }
            log.error(error.config);
            throw errorData;
        }
    }

    /**
     * Http PUT
     */
    public async put(url: string, payload?: any) {
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        const result = await axios.put(requestURL, payload);
        return result.data;
    }

    /**
     * Http DELETE
     */
    public async delete(url: string) {
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        const result = await axios.delete(requestURL);
        return result.data;
    }

    /**
     * Http get by token id
     */
    public async getWithoutAuth(url: string) {
        await this._permissionService.getIdToken();
        const validURL = config.rewrites[url] || url;
        const result = await axios.get(`${config.gateway.gateway_uri}/${validURL}`);
        return result.data;
    }

    /**
     * Http Post by token id
     */
    public async postWithoutAuth(url: string, payload?: any) {
        try {
            const result = await axios.post(`${config.gateway.gateway_uri}/${url}`, payload);
            return result.data;
        } catch (error) {
            log.error(error);
            const errorData = new SocialError('HttpService/WrongSetting', 'Error happened!');

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                log.error(error.response.data);
                log.error(error.response.status);
                log.error(error.response.headers);
                const { data } = error.response;
                if (data.isError) {
                    errorData.code = data.code;
                    errorData.message = data.message;
                } else {
                    errorData.code = 'HttpService/PostWithoutAuth';
                    errorData.message = `The request was made and the server responded with a status code that falls out of the range of 2xx`;
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                log.error(error.request);

                errorData.code = 'HttpService/postWithoutAuth/NoResponse';
                errorData.message = `
                The request was made but no response was received
                error.request is an instance of XMLHttpRequest in the browser and an instance of
                http.ClientRequest in node.js
                `;
            } else {
                // Something happened in setting up the request that triggered an Error
                log.error('Error', error.message);
                errorData.code = 'HttpService/postWithoutAuth/WrongSetting';
                errorData.message = `
                Something happened in setting up the request that triggered an Error
                `;
            }
            log.error(error.config);
            throw errorData;
        }
    }
}
