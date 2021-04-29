import { PostAPI } from 'api/PostAPI';
import { List, Map } from 'immutable';
import { createSelector } from 'reselect';
import galleryGetters from './galleryGetters';

/****************************
 * Selectors
 ***************************/
const selectImages = () => {
    return createSelector([galleryGetters.getImages], (images) => images);
};

const selectLastImageId = () => {
    return createSelector([galleryGetters.getAlbumLastImageId], (imageId) => imageId);
};

const selectMoreImages = () => {
    return createSelector([galleryGetters.hasMoreImages], (moreImages) => moreImages);
};

const selectAlbumImages = () => {
    return createSelector([galleryGetters.getAlbumImages, galleryGetters.getImages], (albumImages, images) => {
        let mappedImages: List<Map<string, any>> = List([]);
        albumImages.forEach((exist, postId) => {
            if (exist) {
                let existPost = images.get(postId);
                if (existPost) {
                    existPost = existPost.set('original', existPost.get('url'));
                    existPost = existPost.set('src', existPost.get('url'));
                    existPost = existPost.set('title', existPost.get('caption', ''));
                    existPost = existPost.set('description', '');
                    mappedImages = mappedImages.push(existPost);
                }
            }
        });

        if (mappedImages.isEmpty()) {
            return List([]);
        }

        return PostAPI.sortImuObjectsDate(mappedImages);
    });
};

const selectGallery = () => {
    return createSelector([galleryGetters.getImages], (images) => {
        let mappedImages: Map<string, Map<string, any>> = Map({});

        images.forEach((image, imageId) => {
            mappedImages = mappedImages.setIn([image.get('directory'), imageId], image);
        });

        return mappedImages;
    });
};

const selectImageGalleryLoaded = () => {
    return createSelector([galleryGetters.getImageGalleryLoaded], (loaded: boolean) => loaded);
};

export const gallerySelector = {
    selectImages,
    selectLastImageId,
    selectMoreImages,
    selectAlbumImages,
    selectGallery,
    selectImageGalleryLoaded,
};
