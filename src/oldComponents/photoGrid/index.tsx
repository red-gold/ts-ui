import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { withStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import ImgCoverComponent from 'components/imgCover';
import React, { Component } from 'react';
import StackGrid, { easings, transitions } from 'react-stack-grid';
import Lightbox from 'lib/react-lit/index';

import { IPhotoGridProps } from './IPhotoGridProps';
import { IPhotoGridState } from './IPhotoGridState';
import { photoGridStyles } from './photoGridStyles';

// - Material UI

export class PhotoGridComponent extends Component<IPhotoGridProps, IPhotoGridState> {
    /**
     * Component constructor
     */
    constructor(props: IPhotoGridProps) {
        super(props);

        // Binding functions to `this`
        this.renderGrid = this.renderGrid.bind(this);
    }

    /**
     * Render grid stack
     */
    renderGrid = (toggleLightbox: any) => {
        const { images, classes, onDelete, isOwner } = this.props;
        const transition = transitions.scaleDown;

        return (
            <StackGrid
                monitorImagesLoaded
                columnWidth={300}
                duration={600}
                gutterWidth={15}
                gutterHeight={15}
                easing={easings.cubicOut}
                appearDelay={60}
                appear={transition.appear}
                appeared={transition.appeared}
                enter={transition.enter}
                entered={transition.entered}
                leaved={transition.leaved}
            >
                {images.map((obj, index) => (
                    <figure key={obj.src} className="image-stack">
                        <ImgCoverComponent
                            src={obj.url}
                            width={'300px'}
                            height={'300px'}
                            onClick={() => {
                                toggleLightbox(index);
                            }}
                        />
                        {/* <img src={obj.url} alt={obj.caption} /> */}
                        {isOwner && (
                            <div className={classes.deleteIcon}>
                                {obj.url !== undefined ? (
                                    <IconButton className={classes.icon} onClick={() => onDelete(obj)}>
                                        <ClearIcon style={{ color: 'white' }} />
                                    </IconButton>
                                ) : (
                                    <CircularProgress
                                        className={classes.progress}
                                        size={30}
                                        style={{ color: 'white', marginLeft: 10 }}
                                    />
                                )}
                            </div>
                        )}
                        <figcaption>{obj.caption}</figcaption>
                    </figure>
                ))}
            </StackGrid>
        );
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { images, classes } = this.props;
        return (
            <Lightbox
                images={images}
                renderImageFunc={(toggleLightbox: any) => {
                    return <div className={classes.root}>{this.renderGrid(toggleLightbox)}</div>;
                }}
            />
        );
    }
}

// - Connect component to redux store
export default withStyles(photoGridStyles as any)(PhotoGridComponent as any);
