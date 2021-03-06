// - Import react components
import React, { Component } from 'react';
import { connect } from 'react-redux';

import config from 'config';
import { WithTranslation, withTranslation } from 'react-i18next';

// - Material UI
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// - Import app components

// - Import API
import StringAPI from 'api/StringAPI';

// - Import actions
import { IAddVideoComponentProps } from './IAddVideoComponentProps';
import { IAddVideoComponentState } from './IAddVideoComponentState';

const styles = (theme: any) => ({
    fullPageXs: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
            margin: 0,
            overflowY: 'auto',
        },
    },
    dialogTitle: {
        padding: 0,
    },
});

/**
 * React component class
 */
export class AddVideoComponent extends Component<IAddVideoComponentProps & WithTranslation, IAddVideoComponentState> {
    /**
     * Component constructor
     *
     */
    constructor(props: IAddVideoComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {
            link: '',
            linkInputError: '',
            disabledOk: true,
        };

        // Binding functions to `this`
    }

    /**
     * Handle add link
     */
    handleAddLink = () => {
        const { onAddLink, onClose } = this.props;
        const { link } = this.state;
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
    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name === 'link') {
            this.validateInputLink(value);
        }
        this.setState({
            [name]: value,
        });
    };

    /**
     * Valide input link
     */
    validateInputLink = (value: string) => {
        const { t } = this.props;

        if (!t) {
            return;
        }
        if (!value || value.trim() === '') {
            this.setState({
                linkInputError: t('post.videoInputLinkRequiredError'),
                disabledOk: true,
            });
        } else if (!StringAPI.validateUrl(value.trim())) {
            this.setState({
                linkInputError: t('post.videoInputLinkInvalidError'),
                disabledOk: true,
            });
        } else {
            this.setState({
                linkInputError: '',
                disabledOk: false,
            });
        }
    };

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, t, open, onClose } = this.props;
        const { disabledOk, linkInputError } = this.state;
        if (!t) {
            return <div />;
        }
        return (
            <Dialog PaperProps={{ className: classes.fullPageXs }} open={open} onClose={onClose} maxWidth="md">
                <DialogTitle>{t('post.addVideoTitle')}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        type="link"
                        name="link"
                        onChange={this.handleInputChange}
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
                        onClick={this.handleAddLink}
                        disabled={disabledOk}
                    >
                        {t('post.addVideoButton')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = () => {
    return {};
};

/**
 * Map state to props
 */
const mapStateToProps = () => {
    return {};
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(AddVideoComponent);
export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles as any)(translateWrapper as any) as any);
