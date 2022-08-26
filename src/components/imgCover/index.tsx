import { createStyles, makeStyles } from '@mui/styles';
import classNames from 'classnames';
import React from 'react';
import { IImgCoverProps } from './IImgCoverProps';

const useStyles = makeStyles(() =>
    createStyles({
        cover: {
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100px',
            fontWeight: 400,
            minHeight: 384,
            backgroundImage: 'url(https://source.unsplash.com/Q7PclNhVRI0)',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
        loadingContent: {
            width: '100%',
            height: '288px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingImage: {
            width: '50px',
            height: '50px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
        },
        noDisplay: {
            display: 'none',
        },
    }),
);
export function ImgCoverComponent(props: IImgCoverProps) {
    const classes = useStyles();

    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    /**
     * Will be called on loading image
     */
    const handleLoadImage = () => {
        setIsImageLoaded(true);
    };

    /**
     * Handle click
     */
    const handleClick = (event: any) => {
        const { onClick } = props;
        if (onClick) {
            onClick(event);
        }
    };

    const { src, style, className } = props;

    return (
        <>
            <div
                onClick={handleClick}
                className={classNames(className, { [classes.cover]: isImageLoaded })}
                style={
                    !isImageLoaded
                        ? { display: 'none' }
                        : (({
                              
                              backgroundImage: `url(${  src || 'https://picsum.photos/id/41/900/300/?blur'  })`,
                                  width: props.width,
                                  height: props.height,
                                  borderRadius: props.borderRadius || 20,
                              ...style,
                          }) as any)
                }
            >
                {props.children}
            </div>
            <div
                className={classNames({ [classes.noDisplay]: isImageLoaded, [classes.loading]: !isImageLoaded })}
                style={{ borderRadius: props.borderRadius || 20 }}
             />
            <img
                alt="..."
                onLoad={handleLoadImage}
                src={src || 'https://picsum.photos/id/41/900/300/?blur'}
                style={{ display: 'none' }}
            />
        </>
    );
}

export default ImgCoverComponent;
