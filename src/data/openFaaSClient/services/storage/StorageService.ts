import { IStorageService } from 'core/services/files'
import { FileResult } from 'models/files/fileResult'
import { injectable, inject } from 'inversify'
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';

@injectable()
export class StorageService implements IStorageService {
  @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService

  /**
   * Upload file on the server
   */
  public uploadFile = (folderName: string, file: any, fileName: string,
    onProgress: (percentage: number, status: boolean, fileName: string, meta?: any) => void,
    onSuccess: (fileResult: FileResult, meta?: any) => void,
    onFailure: (error: any) => void
  ) => {

    var data = new FormData();
    // data.append('foo', 'bar');
    data.append('file',file);
   
    this._httpService.postFile(`storage/${folderName}`, data, fileName, onProgress)
      .then(function (res) {
        onProgress(100, false, fileName)
        console.log(res)
        const downloadURL = res.payload.url
        onSuccess(new FileResult(downloadURL), { url: downloadURL })
      })
      .catch(function (error) {
        
        onFailure(error)
      console.log('========== Upload Image ============')
      console.log(error)
      console.log('====================================')
      });

  }

  /**
   * Delete file
   */
  public deleteFile = async (folderName: string, fileName: string) => {
    return " Not implemented!" as any

  }

}
