import { Map } from 'immutable';
import { Post } from 'core/domain/posts/post';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

export type IPostWriteProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Post write style
     */
    style?: {};

    /**
     * The text of post in editing state
     */
    text?: string;
    /**
     * The image of post in editing state
     */
    image?: string;
    /**
     * If post state is editing this id sould be filled with post identifier
     */
    id?: string;

    /**
     * Styles
     */
    classes?: any;
}

export interface IStateProps {
    currentUser: Map<string, any>;
    albumDialogOpen: boolean;
    progress: Map<string, any>;
    updatePostRequestStatus: ServerRequestStatusType;
    postWriteOpen: boolean;
    edit: boolean;
    postModel: Map<string, any>;
}

export interface IDispatchProps {
    openAlbum: () => any;
    closeAlbum: () => any;
    post: (
        post: Post,
        filesToUpload: {
            src: string;
            file: any;
            fileName: string;
        }[],
    ) => any;
    update: (
        post: Map<string, any>,
        filesToUpload: {
            src: string;
            file: any;
            fileName: string;
        }[],
    ) => any;
    uploadImage: (image: any, imageName: string) => any;
    onRequestClose: () => any;
    setPostWriteModel: (model: Map<string, any> | null) => any;
}
