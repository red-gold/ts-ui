export interface IPostImageUploadState {
    [key: string]: any;
    selectedPhotos: { src: string; fileName: string }[];
    prevPhotos: { src: string; fileName: string }[];
}
