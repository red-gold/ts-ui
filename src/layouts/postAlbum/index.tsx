import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import NoAlbumIcon from '@material-ui/icons/SettingsSystemDaydream';
import classNames from 'classnames';
import PostPhotoGridComponent from 'layouts/postPhotoGrid';
import * as R from 'ramda';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Lightbox from 'lib/react-lit/index.js';

import { IPostAlbumProps } from './IPostAlbumProps';
import { IPostAlbumState } from './IPostAlbumState';
import { postAlbumStyles } from './postAlbumStyles';

// - Material UI

export class PostAlbumComponent extends Component<IPostAlbumProps, IPostAlbumState> {
    /**
     * Component constructor
     */
    constructor(props: IPostAlbumProps) {
        super(props);

        // Defaul state

        this.state = {};

        // Binding functions to `this`
        this.handleImageClick = this.handleImageClick.bind(this);
    }

    /**
     * Handle image click
     */
    handleImageClick = (imageIndex: number, toggleLightbox: any) => {
        toggleLightbox(imageIndex);
    };

    shouldComponentUpdate(nextProps: IPostAlbumProps) {
        if (R.equals(nextProps.images, this.props.images)) {
            return false;
        }

        return true;
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, images, currentAlbum } = this.props;
        if (images && images.size > 0) {
            const mappedImages: any[] = [];
            images.valueSeq().forEach((image) => {
                mappedImages.push({ src: image, url: image, id: image });
            });
            const gridImages = mappedImages.slice(0, 4);
            return (
                <Lightbox
                    images={mappedImages}
                    renderImageFunc={(toggleLightbox: any) => {
                        return (
                            <div className={classes.root}>
                                {
                                    <PostPhotoGridComponent
                                        images={gridImages}
                                        onClick={(event: any, imageIndex: number) =>
                                            this.handleImageClick(imageIndex, toggleLightbox)
                                        }
                                    />
                                }

                                <div
                                    className={classNames(classes.titleContainer, {
                                        [classes.noDisplay]: !(currentAlbum && currentAlbum.get('album').get('title')),
                                    })}
                                >
                                    <div className={classes.aboveContainer} />
                                    <div className={classes.bottomContainer} />
                                    <NavLink
                                        to={`/u/${currentAlbum && currentAlbum.get('ownerUserId')}/album/${
                                            currentAlbum && currentAlbum.get('id')
                                        }`}
                                    >
                                        <Typography className={classes.title}>
                                            {currentAlbum && currentAlbum.get('album').get('title')}
                                        </Typography>
                                    </NavLink>
                                </div>
                            </div>
                        );
                    }}
                />
            );
        } else {
            return (
                <div className={classes.noAlbum}>
                    <NoAlbumIcon className={classes.noAlbumIcon} />
                </div>
            );
        }
    }
}

// - Connect component to redux store
export default withStyles(postAlbumStyles as any)(PostAlbumComponent as any);
