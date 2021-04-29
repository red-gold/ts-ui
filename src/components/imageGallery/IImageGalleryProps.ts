import { Map, List } from 'immutable';

export type IImageGalleryProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    uploadImage: (image: any, imageName: string) => any;
    images: List<Map<string, any>>;
    set: (URL: string) => void;
    close: () => void;
    loadData: () => void;
    folder: string;
    classes?: any;
}

export interface IStateProps {
    currentUser: Map<string, any>;
    progress: Map<string, any>;
    requests: Map<string, any>;
    gallery: Map<string, Map<string, any>>;
}

export interface IDispatchProps {
    deleteImage: (fileId: string, fileName: string) => any;
    loadImageGallery: (dir: string) => any;
    tempAddImageToList: (entities: Map<string, any>) => any;
    tempAddImages: (uid: string, imageIds: Map<string, boolean>) => any;
}
