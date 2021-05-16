// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { PostType } from 'core/domain/posts/postType';
import { PhotoGalleryFile } from 'models/gallery/photoGalleryFile';
import { Map } from 'immutable';

export interface IPostWriteInputProps {
    text: string;
    edit: boolean;
    onPost: () => void;
    onTextChange: (event: any) => void;
    onUploadChange: (event: React.ChangeEvent<HTMLInputElement> | undefined) => void;
    handleOpenVideoLink: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => void;
    handleToggleComments: () => void;
    handleToggleSharing: () => void;
    disableComments: boolean;
    disableSharing: boolean;
    onRemoveImage: () => void;
    postType: PostType;
    image?: string;
    thumbnail?: string;
    disabledPost: boolean;
    selectedPhotos: PhotoGalleryFile[];
    onDeletePhoto: (fileName: string) => void;
    photoProgress: Map<string, any>;
}
