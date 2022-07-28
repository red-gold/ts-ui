// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map, List } from 'immutable';

const getImages = (state: Map<string, any>) => {
    return state.getIn(['imageGallery', 'entities'], Map({})) as Map<string, any>;
};

const hasMoreImages = (state: Map<string, any>, props: { albumId: string }) => {
    return state.getIn(['imageGallery', 'album', props.albumId, 'hasMoreData'], true);
};

const getAlbumImages = (state: Map<string, any>, props: { albumId: string }) => {
    const images = state.getIn(['imageGallery', 'album', props.albumId, 'list'], Map({})) as Map<string, boolean>;
    return images;
};

const getAvatarImages = (state: Map<string, any>, props: { userId: string }) => {
    const images = state.getIn(['imageGallery', 'avatar', props.userId, 'list'], Map({})) as Map<string, boolean>;
    return images;
};

const getCoverImages = (state: Map<string, any>, props: { userId: string }) => {
    const images = state.getIn(['imageGallery', 'cover', props.userId, 'list'], Map({})) as Map<string, boolean>;
    return images;
};

const getAlbumLastImageId = (state: Map<string, any>, props: { albumId: string }) => {
    return state.getIn(['imageGallery', 'album', props.albumId, 'lastImageId'], '');
};

const getImageGalleryLoaded = (state: Map<string, any>) => {
    return state.getIn(['imageGallery', 'loaded']) as boolean;
};

const getGalleryStatus = (state: Map<string, any>) => {
    return state.getIn(['imageGallery', 'status']) as List<Map<string, any>>;
};

export default {
    getImages,
    hasMoreImages,
    getAlbumImages,
    getAvatarImages,
    getCoverImages,
    getAlbumLastImageId,
    getImageGalleryLoaded,
    getGalleryStatus,
};
