import { List } from 'immutable';

export interface IPostAlbumProps {
    classes?: any;
    images: List<string>;
    currentAlbum: Map<string, any>;
}
