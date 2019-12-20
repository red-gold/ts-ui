import { FileResult } from 'models/files/fileResult'
import { User } from 'core/domain/users'
import { Image, FileGallery } from 'core/domain/imageGallery'
import { Media } from 'core/domain/imageGallery/media'
import { Post } from 'core/domain/posts/post'
import {Map} from 'immutable'
/**
 * Image gallery service interface
 */
export interface IImageGalleryService {

  /**
   * Get Gallery
   */
  getGallery: (userId: string, folderName: string) => Promise<{ mappedImages: Map<string, any>, ids: Map<string, boolean>, newLastImageId: string }>

  /**
   * Save File
   */
  saveFile: (userId: string, file: Media, folderName: string) => Promise<string>

  /**
   * Upload File
   */
  uploadFile: (folderName: string, file: any, fileName: string, 
    onProgress: (percentage: number, status: boolean, fileName: string) => void,
    onSuccess: (fileResult: FileResult) => void,
    onFailure: (error: any) => void) => void

  /**
   * Set photo album
   */
  setPhotoAlbum: (userId: string, folderName: string, albumPost: Post, imageIds: Media[]) =>
   Promise<{newAlbum: Map<string, any>, imageIds: Map<string, boolean>, images: Map<string, any>}>

   /**
    * Fetch album images
    */
   fetchAlbumImages: (userId: string, albumId: string, page: number, limit: number, lastPhotoId?: string) => 
   Promise<{mappedImages: Map<string, any>, ids: Map<string, boolean>, newLastImageId: string}>
  
  /**
   * Download File
   */
  downloadFile: (fileName: string, folderName: string) => Promise<string>

  /**
   * Delete file
   */
  deleteFile: (userId: string, imageId: string, folderName: string) => Promise<void>

  /**
   * Delete image
   */
  deleteImage: (folderName: string, fileName: string) => Promise<void>
}
