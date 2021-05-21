import { makeStyles } from '@material-ui/core/styles';
import SvgImage from '@material-ui/icons/Image';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IImgComponentProps } from './IImgComponentProps';

const useStyles = makeStyles(() => ({
    image: {
        verticalAlign: 'top',
        maxWidth: '100%',
        minWidth: '100%',
        width: '100%',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100px',
        position: 'relative',
        color: '#cacecd',
        fontWeight: 400,
    },
    loadingContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    loadingImage: {
        fill: 'aliceblue',
        width: '50px',
        height: '50px',
    },
    noDisplay: {
        display: 'none',
    },
    notLoadedRoot: {
        backgroundColor: 'white',
    },
}));

export function ImgComponent(props: IImgComponentProps) {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const classes = useStyles();
    const { t } = useTranslation();

    /**
     * Handle click on image
     */
    const handleClick = (event: any) => {
        const { onClick } = props;
        if (onClick) {
            onClick(event);
        }
    };

    /**
     * Will be called on loading image
     */
    const handleLoadImage = () => {
        setIsImageLoaded(true);
    };

    const { fileName, style } = props;

    return (
        <>
            <img
                alt={fileName || ''}
                className={classes.image}
                onClick={handleClick}
                onLoad={handleLoadImage}
                src={fileName || ''}
                style={isImageLoaded ? style : { display: 'none' }}
            />
            <div
                className={classNames(
                    classes.notLoadedRoot,
                    { [classes.noDisplay]: isImageLoaded },
                    { [classes.loading]: !isImageLoaded },
                )}
            >
                <div className={classes.loadingContent}>
                    <SvgImage className={classes.loadingImage} />
                    <div>{t('image.notLoaded')}</div>
                </div>
            </div>
        </>
    );
}

export default ImgComponent;
