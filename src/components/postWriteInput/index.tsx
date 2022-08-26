// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { useSelector } from 'react-redux';
import { Map } from 'immutable';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SvgAddVideo from '@mui/icons-material/VideoCall';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import PostImages from 'components/postImages';
import { PostType } from 'core/domain/posts/postType';
import { DialogActions, DialogContent } from '@mui/material';
import { PostImageUploadComponent } from 'components/postImageUpload';
import { experimentalStyled as styled } from '@mui/material/styles';
import MyAvatar from 'components/MyAvatar';
import RightIconMenu from './RightIconMenu';
import { IPostWriteInputProps } from './IPostWriteInputProps';

const selectCurrentUser = authorizeSelector.selectCurrentUser();

const Input = styled('input')({
    display: 'none',
});

const PostTools = styled('div')({
    width: '100%',
    border: '1px solid #ced0d4',
    borderRadius: 8,
    boxShadow: '0 1px 2px #0000001a',
});

export default function PostWriteInput(props: IPostWriteInputProps) {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<any>(null);
    const { t } = useTranslation();

    // Selectors
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));

    const handleOpenMenu = (event: any) => {
        if (event) {
            setMenuAnchorEl((event as any).currentTarget);
        }
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const displayPostImages =
        (props.image && props.image !== '' && props.postType === PostType.Photo) ||
        (props.thumbnail && props.thumbnail !== '' && props.postType === PostType.Video);
    const postImagesElm = displayPostImages ? (
        <PostImages
            onRemoveImage={props.onRemoveImage}
            postType={props.postType}
            thumbnail={props.thumbnail}
            image={props.image}
        />
    ) : (
        ''
    );

    return (
        <>
            <CardHeader
                avatar={<MyAvatar size={36} />}
                action={
                    <RightIconMenu
                        onOpenMenu={handleOpenMenu}
                        onClose={handleCloseMenu}
                        menuAnchorEl={menuAnchorEl}
                        onToggleComments={props.handleToggleComments}
                        onToggleSharing={props.handleToggleSharing}
                        disableComments={props.disableComments}
                        disableSharing={props.disableSharing}
                    />
                }
                title={currentUser.get('fullName')}
                subheader="Public"
            />
            <DialogContent>
                <InputBase
                    autoFocus
                    value={props.text}
                    onChange={props.onTextChange}
                    placeholder={t('post.textareaPlaceholder')}
                    multiline
                    minRows={3}
                    maxRows={4}
                    fullWidth
                    sx={{
                        fontSize: 24,
                    }}
                />
                <br />
                {postImagesElm}
                {props.selectedPhotos.length > 0 && (
                    <PostImageUploadComponent
                        photos={props.selectedPhotos}
                        progress={props.photoProgress}
                        onDelete={props.onDeletePhoto}
                    />
                )}
            </DialogContent>
            <DialogActions disableSpacing>
                <PostTools>
                    <label htmlFor="upload-image-button">
                        <Input
                            id="upload-image-button"
                            accept="image/*"
                            multiple
                            onChange={props.onUploadChange}
                            type="file"
                        />
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera sx={{ fontSize: 25 }} />
                        </IconButton>
                    </label>
                    <IconButton color="primary" onClick={props.handleOpenVideoLink} aria-label="add video">
                        <SvgAddVideo sx={{ fontSize: 28, color: red[500] }} />
                    </IconButton>
                </PostTools>
            </DialogActions>
            <DialogActions>
                <Button
                    variant={'contained'}
                    onClick={props.onPost}
                    sx={{ color: 'white' }}
                    fullWidth
                    disabled={props.disabledPost}
                >
                    {props.edit ? t('post.updateButton') : t('post.postButton')}
                </Button>
            </DialogActions>
        </>
    );
}
