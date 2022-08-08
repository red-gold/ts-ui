import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { injectable, inject } from 'inversify';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import config from 'config';
import axios, { AxiosRequestConfig } from 'axios';
import type { IPermissionService } from 'core/services/security/IPermissionService';
import { SocialError } from 'core/domain/common/socialError';
import { log } from 'utils/log';
import axiosInstance from 'utils/axios';

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
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        const result = await axiosInstance.get(requestURL);
        return result.data;
    }

    /**
     * Http POST
     */
    public async post(url: string, payload?: any, opt?: { headers?: any }) {
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const axiosConfig: AxiosRequestConfig = {};
        if (opt) {
            if (opt.headers) {
                axiosConfig.headers = opt.headers;
            }
        }
        try {
            const result = await axiosInstance.post(`${config.gateway.gateway_uri}/${validURL}`, payload, axiosConfig);
            return result.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Http POST File
     */
    public async postFile(
        url: string,
        payload: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fileName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onProgress: (percentage: number, status: boolean, fileName: string, meta?: any) => void,
    ) {
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const reqConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        try {
            const result = await axiosInstance.post(`${config.gateway.gateway_uri}/${validURL}`, payload, reqConfig);
            return result.data;
        } catch (error: any) {
            log.error(error);
            const errorData = new SocialError('HttpService/WrongSetting', 'Error happened!');

            if (error.error) {
                errorData.code = error.error.code;
                errorData.message = error.error.message;
            } else if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                log.error(error.response.data);
                log.error(error.response.status);
                log.error(error.response.headers);
                const { data } = error.response;
                if (data.isError) {
                    errorData.code = data.code;
                    errorData.message = data.message;
                } else if (error.response.status === 413) {
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
    public async put(url: string, payload?: any, reqConfig?: { params: any }) {
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        try {
            const result = await axiosInstance.put(requestURL, payload, reqConfig);
            return result.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    /**
     * Http DELETE
     */
    public async delete(url: string) {
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const requestURL = `${config.gateway.gateway_uri}/${validURL}`;
        const result = await axiosInstance.delete(requestURL);
        return result.data;
    }

    /**
     * Http get by token id
     */
    public async getWithoutAuth(url: string) {
        url = this.parseURL(url);
        await this._permissionService.getIdToken();
        const validURL = config.rewrites[url] || url;
        const result = await axios.get(`${config.gateway.gateway_uri}/${validURL}`);
        return result.data;
    }

    /**
     * Http Post without token
     */
    public async postWithoutAuth(url: string, payload?: any, opt?: { headers?: any }) {
        url = this.parseURL(url);
        const validURL = config.rewrites[url] || url;
        const axiosConfig: AxiosRequestConfig = {};
        if (opt) {
            if (opt.headers) {
                axiosConfig.headers = opt.headers;
            }
        }
        try {
            const result = await axios.post(`${config.gateway.gateway_uri}/${validURL}`, payload, axiosConfig);
            return result.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    handleError = (error: any) => {
        log.error(error);
        const errorData = new SocialError('HttpService/WrongSetting', 'Error happened!');
        if (error.error) {
            errorData.code = error.error.code;
            errorData.message = error.error.message;
        } else if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            log.error(error.response.data);
            log.error(error.response.status);
            log.error(error.response.headers);
            const { data } = error.response;
            if (data.error) {
                errorData.code = data.error.code;
                errorData.message = data.error.message;
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
    };

    parseURL(url: string) {
        const newURL = url;
        if (!newURL.includes('/')) {
            if (newURL.includes('?')) {
                return newURL.split('?').join('/?');
            }
            return `${newURL}/`;
        }
        return newURL;
    };
    
}
