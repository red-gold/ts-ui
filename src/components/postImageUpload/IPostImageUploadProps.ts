import { Map } from 'immutable';
import { Post } from 'core/domain/posts/post';
import { PhotoGalleryFile } from 'models/gallery/photoGalleryFile';

export interface IPostImageUploadProps {
    /**
     * File progress state
     */
    progress: Map<string, any>;

    /**
     * Selected photos
     */
    photos: PhotoGalleryFile[];

    /**
     * Handle delete file
     */
    onDelete: (fileName: string) => void;

    /**
     * Current album to edit
     */
    currentAlbum?: Post;
}
