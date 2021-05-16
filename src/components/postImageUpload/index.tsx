import IconButton from '@material-ui/core/IconButton';
import SvgDelete from '@material-ui/icons/Delete';
import React from 'react';

import { IPostImageUploadProps } from './IPostImageUploadProps';
import { PhotoGalleryFile } from 'models/gallery/photoGalleryFile';
import { useStyles } from './postImageUploadStyles';
import Stack from '@material-ui/core/Stack';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const TrashButton = styled(IconButton)({
    color: '#fffffff5',
    position: 'absolute',
    top: '0px',
    right: '0px',
    background: '#5454547d',
    padding: 6,
    fontSize: '1.2rem',
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#545454a6' },
});

export function PostImageUploadComponent(props: IPostImageUploadProps) {
    const [selectedPhotos, setSelectedPhotos] = React.useState<PhotoGalleryFile[]>(props.photos);
    const classes = useStyles();

    // Dispatchers
    // const dispatch = useDispatch();
    // const deleteImage = (fileId: string, fileName: string) =>
    //     dispatch(imageGalleryActions.dbDeleteImage(fileId, config.data.imageFolderPath, fileName));
    // const progressChange = (percent: number, status: boolean) =>
    //     dispatch(globalActions.progressChange(percent, status));

    // Selectors
    // const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    // const requestId = StringAPI.createServerRequestId(ServerRequestType.GalleryCreateAlbum, currentUser.get('userId'));
    // const createAlbumRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId }));
    // const createAlbumRequestStatus = createAlbumRequest.get('status', ServerRequestStatusType.NoAction);
    /**
     * Save album
     */
    // const saveAlbum = () => {
    //     const { progress, currentUser } = props;

    //     // const albumTitle = StringAPI.isEmpty(state.albumName) ? t('album.defaultAlbumName') : state.albumName;

    //     const images: Media[] = [];
    //     selectedPhotos.slice(0, 4).forEach((photo) => {
    //         const meta = progress.getIn([photo.fileName, 'meta'], { url: '' });
    //         const fileId = photo.fileName.split('.')[0];
    //         const image = new Media(
    //             fileId,
    //             0,
    //             0,
    //             meta.url || URL.createObjectURL(photo.src),
    //             meta.url || URL.createObjectURL(photo.src),
    //             photo.fileName,
    //             '',
    //             '',
    //             photo.fileName,
    //             throwNoValue(currentUser, 'currentUser').userId,
    //             0,
    //             '',
    //             0,
    //             0,
    //             '',
    //             false,
    //             [],
    //             UserPermissionType.Public,
    //         );
    //         images.push(image);
    //         return {
    //             url: meta.url,
    //             fileName: photo.fileName,
    //             fileId,
    //         };
    //     });
    // };

    React.useEffect(() => {
        setSelectedPhotos(props.photos);
    }, [props.photos.length]);

    /**
     * Delete selected photo
     */
    const deleteSelectedPhoto = (fileName: string) => {
        const { onDelete } = props;
        const newSelectedPhotos = selectedPhotos.filter((photo) => photo.fileName !== fileName);
        setSelectedPhotos(newSelectedPhotos);

        onDelete(fileName);
    };

    /**
     * Image list
     */
    const imageList = () => {
        return selectedPhotos.map((photo) => {
            return (
                <div className={classes.imgRoot} key={photo.src}>
                    <img width={100} height={100} src={photo.src} alt={'something'} className={classes.img} />
                    <TrashButton onClick={() => deleteSelectedPhoto(photo.fileName)}>
                        <SvgDelete />
                    </TrashButton>
                </div>
            );
        });
    };

    return (
        <Stack justifyContent={'flex-start'} direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
            {imageList()}
        </Stack>
    );
}

export default PostImageUploadComponent;
