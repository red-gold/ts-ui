/**
 * Http service interface
 */
export interface IHttpService {
    get: (url: string, params?: any) => Promise<any>;
    post: (url: string, payload?: any, opt?: { headers?: any }) => Promise<any>;
    postFile: (
        url: string,
        payload: any,
        fileName: string,
        onProgress: (percentage: number, status: boolean, fileName: string, meta?: any) => void,
    ) => Promise<any>;
    put: (url: string, payload?: any, reqConfig?: { params: any }) => Promise<any>;
    delete: (url: string) => Promise<any>;
    getWithoutAuth: (url: string, params?: any) => Promise<any>;
    postWithoutAuth: (url: string, payload?: any) => Promise<any>;
}
