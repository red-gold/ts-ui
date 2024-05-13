import NoAlbumIcon from '@mui/icons-material/SettingsSystemDaydream';
import * as R from 'ramda';
import { memo, useMemo, useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { List, Map } from 'immutable';
import Lightbox from 'yet-another-react-lightbox';
import Inline from 'yet-another-react-lightbox/plugins/inline';

// ----------------------------------------------------------------------
interface IPostAlbumProps {
    images: List<string>;
    currentAlbum: Map<string, any>;
}
// ----------------------------------------------------------------------

function PostAlbumComponent({ images, currentAlbum }: IPostAlbumProps) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const toggleOpen = (state: boolean) => () => setOpen(state);

    const updateIndex = ({ index: current }: { index: number }) => setIndex(current);

    const mappedImages = useMemo(() => {
        if (!images) {
            return [];
        }
        const mappedImages: any[] = [];
        images.valueSeq().forEach((image) => {
            mappedImages.push({ src: image, url: image, id: image });
        });
        return mappedImages;
    }, [images]);

    if (images && images.size > 0) {
        return (
            <>
                <Lightbox
                    index={index}
                    slides={mappedImages}
                    plugins={[Inline]}
                    on={{
                        view: updateIndex,
                        click: toggleOpen(true),
                    }}
                    carousel={{
                        padding: 0,
                        spacing: 0,
                        imageFit: 'cover',
                    }}
                    inline={{
                        style: {
                            width: '100%',
                            maxWidth: '900px',
                            aspectRatio: '3 / 2',
                            margin: '0 auto',
                        },
                    }}
                />

                <Lightbox
                    open={open}
                    close={toggleOpen(false)}
                    index={index}
                    slides={mappedImages}
                    on={{ view: updateIndex }}
                    animation={{ fade: 0 }}
                    controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
                />
            </>
        );
    }
    return (
        <div className={classes.noAlbum}>
            <NoAlbumIcon className={classes.noAlbumIcon} />
        </div>
    );
}

// ----------------------------------------------------------------------

export const useStyles = makeStyles((theme: any) =>
    createStyles({
        noAlbum: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        noAlbumIcon: {
            fontSize: 50,
        },
    }),
);

// ----------------------------------------------------------------------

export default memo(PostAlbumComponent, (props, nextProps) => {
    return R.equals(nextProps.images, props.images);
});
