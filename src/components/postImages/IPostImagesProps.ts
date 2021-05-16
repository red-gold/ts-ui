// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { PostType } from 'core/domain/posts/postType';

export interface IPostImagesProps {
    onRemoveImage: () => void;
    postType: PostType;
    image?: string;
    thumbnail?: string;
}
