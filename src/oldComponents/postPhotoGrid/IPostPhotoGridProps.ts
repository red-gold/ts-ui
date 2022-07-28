import { Media } from 'core/domain/imageGallery/media';
import React from 'react';

export interface IPostPhotoGridProps {
    classes?: any;
    images: Media[];
    onClick?: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
}
