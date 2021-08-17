import { Map, List } from 'immutable';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

export type IGalleryProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
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
    uploadRequestStatus: ServerRequestStatusType;
    gallery: Map<string, Map<string, any>>;
}

export interface IDispatchProps {
    uploadOneImage: (image: any, imageName: string, dir: string) => any;
    deleteImage: (fileId: string, fileName: string) => any;
    loadImageGallery: (dir: string) => any;
    tempAddImageToList: (entities: Map<string, any>) => any;
    tempAddImages: (uid: string, imageIds: Map<string, boolean>) => any;
}
