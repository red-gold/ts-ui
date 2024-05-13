import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import { createStyles, makeStyles } from '@mui/styles';
import React, { useState, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { List } from 'immutable';

// -------------------------------------------------

interface IPictureDialogProps {
    open: boolean;
    images: string[];
    onClose: () => void;
}

// -------------------------------------------------
export class BackDropIOSWorkaround extends React.PureComponent<BackdropProps> {
    protected onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    // eslint-disable-next-line no-undef
    public render(): JSX.Element {
        return <Backdrop {...this.props} onTouchMove={this.onTouchMove} />;
    }
}

export default function PictureDialogComponent({ onClose, open, images }: IPictureDialogProps) {
    const mappedImages = useMemo(() => {
        return images.map((i) => ({ src: i }));
    }, [images]);

    return <Lightbox open={open} close={onClose} slides={mappedImages} />;
}

// ----------------------------------------------------------------------
