import React from 'react';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import StringAPI from 'api/StringAPI';

import { IAddVideoProps } from './IAddVideoProps';
import MobileDialog from 'components/mobileDialog';
import config from 'config';
import { useTranslation } from 'react-i18next';

export function AddVideoComponent(props: IAddVideoProps) {
    const [link, setLink] = React.useState('');
    const [linkInputError, setLinkInputError] = React.useState('');
    const [disabledOk, setDisabledOk] = React.useState(true);
    const { t } = useTranslation();
    /**
     * Handle add link
     */
    const handleAddLink = () => {
        const { onAddLink, onClose } = props;
        if (link && link.trim() !== '') {
            const thumbnail = StringAPI.validateYoutubeUrl(link)
                ? StringAPI.getYoutubetThumbnails(link)
                : config.settings.defaultVideoThumbnails;
            onAddLink(link, thumbnail);
        }
        onClose();
    };

    /**
     * Handle data on input change
     */
    const handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        validateInputLink(value);
        setLink(value);
    };

    /**
     * Valide input link
     */
    const validateInputLink = (value: string) => {
        if (!value || value.trim() === '') {
            setLinkInputError(t('post.videoInputLinkRequiredError'));
            setDisabledOk(true);
        } else if (!StringAPI.validateUrl(value.trim())) {
            setLinkInputError(t('post.videoInputLinkInvalidError'));
            setDisabledOk(true);
        } else {
            setLinkInputError(t(''));
            setDisabledOk(false);
        }
    };

    const { open, onClose } = props;
    if (!t) {
        return <div />;
    }
    return (
        <MobileDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('post.addVideoTitle')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    type="link"
                    name="link"
                    placeholder={'https://www.youtube.com/watch?v=M-vjKGIvzWM'}
                    onChange={handleInputChange}
                    helperText={linkInputError}
                    error={linkInputError !== ''}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disableFocusRipple={true}
                    disableRipple={true}
                    onClick={onClose}
                    style={{ color: grey[800] }}
                >
                    {t('post.cancelButton')}
                </Button>
                <Button
                    color="primary"
                    disableFocusRipple={true}
                    disableRipple={true}
                    onClick={handleAddLink}
                    disabled={disabledOk}
                >
                    {t('post.addVideoButton')}
                </Button>
            </DialogActions>
        </MobileDialog>
    );
}

export default AddVideoComponent;
