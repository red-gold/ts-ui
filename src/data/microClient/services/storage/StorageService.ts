import type { IStorageService } from 'core/services/files/IStorageService';
import { FileResult } from 'models/files/fileResult';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { log } from 'utils/log';

@injectable()
export class StorageService implements IStorageService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    /**
     * Upload file on the server
     */
    public uploadFile = (
        folderName: string,
        file: any,
        fileName: string,
        onProgress: (percentage: number, status: boolean, fileName: string, meta?: any) => void,
        onSuccess: (fileResult: FileResult, meta?: any) => void,
        onFailure: (error: any) => void,
    ) => {
        const data = new FormData();
        // data.append('foo', 'bar');
        data.append('file', file);

        this._httpService
            .postFile(`storage/${folderName}`, data, fileName, onProgress)
            .then((res) => {
                onProgress(100, false, fileName);
                log.info(res);
                const downloadURL = res.payload;
                onSuccess(new FileResult(downloadURL), { url: downloadURL });
            })
            .catch((error) => {
                onFailure(error);
                log.error('========== Upload Image ============');
                log.error(error);
                log.error('====================================');
            });
    };

    /**
     * Delete file
     */
    public deleteFile = async () => {
        return ' Not implemented!' as any;
    };
}
