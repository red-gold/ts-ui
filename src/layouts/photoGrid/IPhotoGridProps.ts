import { Media } from 'core/domain/imageGallery/media'

export interface IPhotoGridProps {
    classes?: any
    images: any[]
    cols: number
    onDelete: (file: any) => void,
    isOwner: boolean
}
