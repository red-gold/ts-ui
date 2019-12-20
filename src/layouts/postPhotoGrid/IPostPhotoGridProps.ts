import { Media } from 'core/domain/imageGallery/media'

export interface IPostPhotoGridProps {
    classes?: any
    images: Media[]
    onClick?: (event: React.MouseEvent<HTMLDivElement>, index: number) => void
}
