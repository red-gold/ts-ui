import withStyles from '@material-ui/core/styles/withStyles';
import { Media } from 'core/domain/imageGallery/media';
import PhotoGridComponent from 'layouts/photoGrid';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import Measure from 'react-measure';
import LoadMoreProgressComponent from 'layouts/loadMoreProgress';

import { connectPhotoStream } from './connectPhotoStream';
import { IPhotoStreamProps } from './IPhotoStreamProps';
import { IPhotoStreamState } from './IPhotoStreamState';
import { photoStreamStyles } from './photoStreamStyles';

export class PhotoStreamComponent extends Component<IPhotoStreamProps & WithTranslation, IPhotoStreamState> {
    constructor(props: IPhotoStreamProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            lightboxIsOpen: false,
            currentImage: 0,
            width: -1,
        };

        // Binding functions to `this`
    }

    loader = () => {
        const { loadPhotos } = this.props;
        if (loadPhotos) {
            loadPhotos(0);
        }
    };

    /**
     * Handle delete photo
     */
    handleDelete = (file: Media) => {
        const { deleteImage, onDelete } = this.props;
        if (deleteImage) {
            deleteImage(file.objectId, file.fileName);
        }
        if (onDelete) {
            onDelete(file.objectId);
        }
    };

    /**
     * Render gallery
     */
    renderGallery = () => {
        const { images, currentUser, currentAlbum } = this.props;
        const { width } = this.state;

        return (
            <Measure
                bounds
                onResize={(contentRect) => this.setState({ width: contentRect.bounds ? contentRect.bounds.width : 0 })}
            >
                {({ measureRef }) => {
                    if (width < 1) {
                        return <div ref={measureRef}></div>;
                    }
                    let columns = 1;
                    if (width >= 480) {
                        columns = 2;
                    }
                    if (width >= 1024) {
                        columns = 3;
                    }
                    if (width >= 1824) {
                        columns = 4;
                    }
                    return (
                        <div ref={measureRef}>
                            <PhotoGridComponent
                                isOwner={
                                    currentAlbum && currentUser
                                        ? currentAlbum.ownerUserId === currentUser.userId
                                        : false
                                }
                                images={images}
                                cols={columns}
                                onDelete={this.handleDelete}
                            />
                        </div>
                    );
                }}
            </Measure>
        );
    };

    render() {
        const { images, hasMorePhotos } = this.props;

        return (
            <InfiniteScroll
                dataLength={images ? images.length : 0}
                next={this.loader}
                hasMore={hasMorePhotos || false}
                endMessage={''}
                loader={<LoadMoreProgressComponent key="stream-load-more-progress" />}
            >
                {this.renderGallery()}
            </InfiniteScroll>
        );
    }
}

const translateWrraper = withTranslation('translations')(PhotoStreamComponent);
export default connectPhotoStream(withStyles(photoStreamStyles)(translateWrraper));
