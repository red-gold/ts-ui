import React from 'react';

export interface IImgCoverProps {
    /**
     * Image file name
     */
    src: string;

    /**
     * Handle click evenr
     */
    onClick?: (event?: any, obj?: any) => void;

    /**
     * Image style
     */
    style?: {};

    /**
     * Image with
     */
    width?: string;

    /**
     * Image height
     */
    height?: string;

    /**
     * Image border radius
     */
    borderRadius?: string;

    /**
     * Class name
     */
    className?: any;

    children?: React.ReactNode;
}
