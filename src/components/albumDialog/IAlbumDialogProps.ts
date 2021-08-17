import { Map } from 'immutable';
import { Post } from 'core/domain/posts/post';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { Media } from 'core/domain/imageGallery/media';

export type IAlbumDialogProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Whether dialog is open
     */

    /**
     * Close image gallery
     */

    /**
     * Styles
     */
    classes?: any;

    /**
     * Theme
     */
    theme?: any;

    /**
     * File progress state
     */
    progress: Map<string, any>;

    /**
     * Current album to edit
     */
    currentAlbum?: Post;
    open: boolean;
    photos: { src: string; file: any; fileName: string }[];
    onClose: () => any;
}

export interface IStateProps {
    currentUser: Map<string, any>;
    createAlbumRequestStatus: ServerRequestStatusType;
}

export interface IDispatchProps {
    post: (albumPost: Post, images: Media[]) => any;
    uploadImage: (image: any, imageName: string) => any;
    deleteImage: (fileId: string, fileName: string) => any;
    progressChange: (percent: number, status: boolean) => any;
}
