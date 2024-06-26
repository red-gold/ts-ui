import { SocialError } from 'core/domain/common/socialError';
import { Media } from 'core/domain/imageGallery/media';
import { Post } from 'core/domain/posts/post';
import type { IStorageService } from 'core/services/files/IStorageService';
import { IImageGalleryService } from 'core/services/imageGallery/IImageGalleryService';
import { fromJS, Map } from 'immutable';
import { injectable, inject } from 'inversify';
import { FileResult } from 'models/files/fileResult';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { PhotoModel } from 'models/gallery/photoModel';
import { v4 as uuid } from 'uuid';
import type { IPostService } from 'core/services/posts/IPostService';

/**
 * OpenFaaS image gallery service
 */

export class ImageGalleryService implements IImageGalleryService {
    private _storageService: IStorageService;

    private _postService: IPostService;

    private _httpService: IHttpService;

    constructor(httpService: IHttpService, storageService: IStorageService, postService: IPostService) {
        this._httpService = httpService;
        this._storageService = storageService;
        this._postService = postService;
        this.uploadFile = this.uploadFile.bind(this);
    }

    /**
     * Get gallery
     */
    public getGallery = async (userId: string, folderName: string) => {
        try {
            const result = await this._httpService.get(`media/dir/${folderName}`);
            let imageIds: Map<string, boolean> = Map({});
            let parsedData: Map<string, Map<string, any>> = Map({});
            const resultExist = result && result.length && result.length > 0;
            const newLastImageId = resultExist ? result[0].objectId : '';
            if (resultExist) {
                result.forEach((media: any) => {
                    const parsedMedia = {
                        ...media,
                        id: media.objectId,
                        creationDate: media.created_date,
                    };
                    parsedData = parsedData.set(media.objectId, Map(parsedMedia));
                    imageIds = imageIds.set(media.objectId, true);
                });
            }
            return { mappedImages: parsedData, ids: imageIds, newLastImageId };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Save images' information
     */
    public saveImages = async (userId: string, folderName: string, photos: Media[]) => {
        const savedPhotos: PhotoModel[] = [];
        photos.forEach((photo) => {
            photo.objectId = uuid();
            savedPhotos.push(
                new PhotoModel(
                    photo.objectId,
                    0,
                    0,
                    photo.thumbnail,
                    photo.url,
                    '',
                    photo.caption,
                    folderName,
                    photo.fileName,
                    photo.ownerUserId,
                    0,
                    photo.albumId === '' ? '00000000-0000-0000-0000-000000000000' : photo.albumId,
                    photo.height,
                    photo.width,
                    photo.meta,
                    false,
                    photo.accessUserList,
                    photo.permission,
                ),
            );
        });
        try {
            await this._httpService.post('media/list', { list: savedPhotos });
            return photos;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Create an album
     */
    public setPhotoAlbum = async (userId: string, folderName: string, albumPost: Post, images: Media[]) => {
        const albumId = uuid();
        albumPost.id = albumId;
        const postAlbum$ = this._postService.addPost(albumPost);

        images.forEach((image) => {
            image.albumId = albumId;
        });

        const saveImages$ = this.saveImages(userId, folderName, images);
        await Promise.all([postAlbum$, saveImages$]);
        let imageIds: Map<string, boolean> = Map({});
        let mappedImages: Map<string, any> = Map({});
        images.forEach((image) => {
            const mappedImage = fromJS({ ...image });
            mappedImages = mappedImages.set(image.objectId, mappedImage);

            imageIds = imageIds.set(image.objectId, true);
        });
        let mappedPost = fromJS({ ...albumPost }) as Map<string, any>;
        mappedPost = mappedPost.set('album', fromJS({ ...albumPost.album }));
        return { newAlbum: mappedPost, imageIds, images: mappedImages };
    };

    /**
     * Fetch album images
     */
    public fetchAlbumImages = async (userId: string, albumId: string, page: number, limit = 10) => {
        const result = await this._httpService.get(`posts?album=${albumId}&page=${page + 1}&limit=${limit}`);

        let mappedImages = Map({});
        const resultExist = result && result.length && result.length > 0;
        const newLastImageId = resultExist ? result[0].objectId : '';
        let imageIds: Map<string, boolean> = Map({});
        if (resultExist) {
            result.forEach((media: any) => {
                mappedImages = mappedImages.set(media.objectId, fromJS(media));
                imageIds = imageIds.set(media.objectId, true);
            });
        }

        return { mappedImages, ids: imageIds, newLastImageId };
    };

    /**
     * Save file
     */
    public saveFile = async (userId: string, file: Media, folderName: string) => {
        try {
            file.directory = folderName;
            file.albumId = file.albumId === '' ? '00000000-0000-0000-0000-000000000000' : file.albumId;
            const result = await this._httpService.post('media', file);
            return result.objectId;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Delte image file
     */
    public deleteImage = async (folderName: string, fileName: string) => {
        await this._storageService.deleteFile(folderName, fileName);
    };

    /**
     * Delete file
     */
    public deleteFile = async (userId: string, imageId: string) => {
        try {
            await this._httpService.delete(`media/id/${imageId}`);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Upload file
     */
    public uploadFile: (
        folderName: string,
        file: any,
        fileName: string,
        onProgress: (percentage: number, status: boolean, fileName: string) => void,
        onSuccess: (fileResult: FileResult) => void,
        onFailure: (error: any) => void,
    ) => void = (folderName, file, fileName, onProgress, onSuccess, onFailure) => {
        this._storageService.uploadFile(folderName, file, fileName, onProgress, onSuccess, onFailure);
    };

    /**
     * Download file
     */
    public downloadFile = () => {
        return 'Not implemented!' as any;
    };
}
