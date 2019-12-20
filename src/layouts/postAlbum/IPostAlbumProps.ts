import { Media } from 'core/domain/imageGallery/media'
import { Post } from 'core/domain/posts'
import {List} from 'immutable'

export interface IPostAlbumProps {
    classes?: any
    images: List<string>
    currentAlbum: Map<string, any>
}
