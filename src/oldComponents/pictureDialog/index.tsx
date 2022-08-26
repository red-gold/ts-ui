import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import { withStyles } from '@mui/styles';
import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

import { IPictureDialogProps } from './IPictureDialogProps';
import { IPictureDialogState } from './IPictureDialogState';
import { pictureDialogStyles } from './pictureDialogStyles';

// - Material UI

export class BackDropIOSWorkaround extends React.PureComponent<BackdropProps> {
    protected onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    // eslint-disable-next-line no-undef
    public render(): JSX.Element {
        return <Backdrop {...this.props} onTouchMove={this.onTouchMove} />;
    }
}

export class PictureDialogComponent extends Component<IPictureDialogProps, IPictureDialogState> {
    /**
     * Fields
     */

    /**
     * Component constructor
     */
    constructor(props: IPictureDialogProps) {
        super(props);
        // Defaul state
        this.state = {
            photoIndex: 0,
        };
        // Binding functions to `this`
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { onClose, open, images } = this.props;
        const { photoIndex } = this.state;

        return (
            <div>
                {open && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={onClose}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length,
                            })
                        }
                    />
                )}
            </div>
        );
    }
}

// - Connect component to redux store
export default withStyles(pictureDialogStyles as any)(PictureDialogComponent as any);
