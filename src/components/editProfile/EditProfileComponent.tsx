import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SvgCamera from '@material-ui/icons/PhotoCamera';
import ImageEditor from 'components/ImageEditor';
import ImgCover from 'components/imgCover';
import UserAvatarComponent from 'components/userAvatar/UserAvatarComponent';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import AppDialogTitle from 'layouts/dialogTitle/DialogTitleComponent';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import config from 'config';
import { IEditProfileProps } from './IEditProfileProps';
import { IEditProfileState } from './IEditProfileState';
import { connectEditProfile } from './connectEditProfile';
import MobileDialog from '../mobileDialog';
import GalleryComponent from '../gallery';
import DatePicker from '../datePicker';
import { Map } from 'immutable';
import isEmpty from 'validator/lib/isEmpty';
import isURL from 'validator/lib/isURL';

export class EditProfileComponent extends Component<IEditProfileProps & WithTranslation, IEditProfileState> {
    constructor(props: IEditProfileProps & WithTranslation) {
        super(props);
        const { currentUser } = props;
        // Defaul state
        this.state = {
            /**
             * If it's true the winow is in small size
             */
            isSmall: false,
            /**
             * User tag line input value
             */
            tagLineInput: currentUser.get('tagLine', ''),
            /**
             * User full name input value
             */
            fullNameInput: currentUser.get('fullName', ''),
            /**
             * User banner address
             */
            banner: currentUser.get('banner', config.settings.defaultProfileCover),
            /**
             * User avatar address
             */
            avatar: currentUser.get('avatar', ''),
            /**
             * It's true if the image galley for banner is open
             */
            openBanner: false,
            /**
             * It's true if the image gallery for avatar is open
             */
            openAvatar: false,
            /**
             * Whether image editor is open
             */
            isImageEditorOpen: false,
            /**
             * Image URL of image editor
             */
            imageEditorUrl: '',
            /**
             * User's original banner URL
             */
            originalBanner: '',

            /**
             * Seleted birth day
             */
            selectedBirthday:
                currentUser && currentUser.get('birthday') ? moment.unix(currentUser.get('birthday')).toDate() : null,
            /**
             * Web URL
             */
            webUrl: currentUser && currentUser.get('webUrl'),
            /**
             * User company name
             */
            companyName: currentUser && currentUser.get('companyName') ? currentUser.get('companyName') : '',
            /**
             * User twitter id
             */
            twitterId: currentUser && currentUser.get('twitterId') ? currentUser.get('twitterId') : '',
            /**
             * User facebook id
             */
            facebookId: currentUser && currentUser.get('facebookId') ? currentUser.get('facebookId') : '',
            /**
             * User facebook id
             */
            permission:
                currentUser && currentUser.get('permission')
                    ? currentUser.get('permission')
                    : UserPermissionType.Public,
            /**
             * User facebook id
             */
            accessUserList: currentUser && currentUser.get('accessUserList') ? currentUser.get('accessUserList') : [],

            /**
             * Input errors
             */
            errors: Map({}),
        };

        // Binding functions to `this`
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRequestSetAvatar = this.handleRequestSetAvatar.bind(this);
        this.handleRequestSetBanner = this.handleRequestSetBanner.bind(this);
        this.loadAvatarList = this.loadAvatarList.bind(this);
        this.loadCoverList = this.loadCoverList.bind(this);
    }

    /**
     * Close image gallery of banner
     */
    handleCloseBannerGallery = () => {
        this.setState({
            openBanner: false,
        });
    };

    /**
     * Open image gallery of banner
     */
    handleOpenBannerGallery = () => {
        this.setState({
            openBanner: true,
        });
    };

    /**
     * Close image gallery of avatar
     */
    handleCloseAvatarGallery = () => {
        this.setState({
            openAvatar: false,
        });
    };

    /**
     * Open image gallery of avatar
     */
    handleOpenAvatarGallery = () => {
        this.setState({
            openAvatar: true,
        });
    };

    /**
     * Set banner edited image url
     */
    handleRequestSetEditedBanner = (url: string) => {
        this.setState({
            banner: url,
        });
    };

    /**
     * Set banner image url
     */
    handleRequestSetBanner = (url: string) => {
        // this.setState({
        //   originalBanner: url
        // })
        // this.handleOpenImageEditor()
        this.handleRequestSetEditedBanner(url);
    };

    /**
     * Open image image editor
     */
    handleOpenImageEditor = () => {
        this.setState({
            isImageEditorOpen: true,
        });
    };

    /**
     * Close image image editor
     */
    handleCloseImageEditor = () => {
        this.setState({
            isImageEditorOpen: false,
        });
    };

    /**
     * Set avatar image url
     */
    handleRequestSetAvatar = (fileName: string) => {
        this.setState({
            avatar: fileName,
        });
    };

    /**
     * Validate inputs
     */
    validateInputs = () => {
        let errors: Map<string, string> = Map({});
        const { fullNameInput, webUrl } = this.state;
        const { t } = this.props;
        if (isEmpty(fullNameInput, { ignore_whitespace: true })) {
            errors = errors.set('fullNameInput', t('profile.fullNameInputError'));
        }
        if (!isEmpty(fullNameInput, { ignore_whitespace: true }) && !isURL(webUrl, { require_protocol: true })) {
            errors = errors.set('webUrl', t('profile.webURLInputError'));
        }
        this.setState({ errors });
    };

    /**
     * Update profile on the server
     */
    handleUpdate = () => {
        const {
            fullNameInput,
            tagLineInput,
            avatar,
            banner,
            selectedBirthday,
            companyName,
            webUrl,
            twitterId,
            facebookId,
            accessUserList,
            permission,
            errors,
        } = this.state;
        const { currentUser, update } = this.props;

        if (!errors.size) {
            update({
                fullName: fullNameInput,
                tagLine: tagLineInput,
                avatar: avatar,
                banner: banner,
                companyName: companyName,
                webUrl: webUrl,
                twitterId: twitterId,
                facebookId: facebookId,
                creationDate: currentUser.get('creationDate'),
                birthday: !!selectedBirthday ? moment(selectedBirthday).unix() : 0,
                permission,
                accessUserList,
                userId: currentUser.get('userId'),
            });
        }
    };

    /**
     * Handle data on input change
     */
    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState(
            {
                [name]: value,
            },
            () => {
                this.validateInputs();
            },
        );
    };

    /**
     * Load cover image list
     */
    loadCoverList = () => {
        const { loadCoverList, currentUser } = this.props;
        if (currentUser && currentUser.get('userId')) {
            loadCoverList(currentUser.get('userId'));
        }
    };

    /**
     * Load avatar image list
     */
    loadAvatarList = () => {
        const { loadAvatarList, currentUser } = this.props;
        if (currentUser && currentUser.get('userId')) {
            loadAvatarList(currentUser.get('userId'));
        }
    };

    /**
     * Handle birthday date changed
     */
    handleBirthdayDateChange = (date: any) => {
        this.setState({ selectedBirthday: date });
    };

    componentDidMount() {}

    render() {
        const { classes, t, coverImages, avatarImages, currentUser } = this.props;
        const {
            webUrl,
            twitterId,
            companyName,
            selectedBirthday,
            isImageEditorOpen,
            originalBanner,
            facebookId,
        } = this.state;

        return (
            <div>
                {/* Edit profile dialog */}
                <MobileDialog
                    key="Edit-Profile"
                    open={this.props.open}
                    onClose={this.props.onRequestClose}
                    scroll={'paper'}
                    fullWidth
                >
                    <DialogContent>
                        {/* Banner */}
                        <div style={{ position: 'relative' }}>
                            <ImgCover width="100%" height="250px" borderRadius="2px" src={this.state.banner} />
                            <div
                                className="g__circle-black"
                                onClick={this.handleOpenBannerGallery}
                                style={{ position: 'absolute', right: '10px', top: '10px' }}
                            >
                                <SvgCamera
                                    style={{ fill: 'rgba(255, 255, 255, 0.88)', transform: 'translate(6px, 6px)' }}
                                />
                            </div>
                        </div>
                        <div className="profile__edit">
                            <div className="left">
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {/* Avatar */}
                                    <div
                                        className="g__circle-black"
                                        onClick={this.handleOpenAvatarGallery}
                                        style={{
                                            zIndex: 1,
                                            position: 'absolute',
                                            left: '50%',
                                            display: 'inline-block',
                                            top: '52px',
                                            margin: '-18px',
                                        }}
                                    >
                                        <SvgCamera
                                            style={{
                                                fill: 'rgba(255, 255, 255, 0.88)',
                                                transform: 'translate(6px, 6px)',
                                            }}
                                        />
                                    </div>
                                    <UserAvatarComponent
                                        fullName={currentUser ? currentUser.get('fullName') : ''}
                                        fileName={this.state.avatar}
                                        size={90}
                                        className={classes.avatar}
                                    />
                                </div>
                                <div className="info">
                                    <div className="fullName">{this.props.fullName}</div>
                                </div>
                            </div>
                        </div>

                        {/* Edit user information box*/}
                        <div className={classes.box}>
                            <TextField
                                id="fullNameInput"
                                label={t('profile.fullName')}
                                onChange={this.handleInputChange}
                                name="fullNameInput"
                                value={this.state.fullNameInput}
                                fullWidth
                                error={!!this.state.errors.get('fullNameInput')}
                                helperText={this.state.errors.get('fullNameInput')}
                            />
                        </div>
                        <div className={classes.box}>
                            <TextField
                                id="tagLineInput"
                                label={t('profile.bio')}
                                onChange={this.handleInputChange}
                                name="tagLineInput"
                                value={this.state.tagLineInput}
                                multiline
                                maxRows={3}
                                fullWidth
                            />
                        </div>
                        <div className={classes.box}>
                            <TextField
                                className={classes.bottomTextSpace}
                                onChange={this.handleInputChange}
                                name="companyName"
                                value={companyName}
                                label={t('profile.companyName')}
                                fullWidth
                            />
                        </div>
                        <div className={classes.box}>
                            <TextField
                                className={classes.bottomTextSpace}
                                onChange={this.handleInputChange}
                                name="twitterId"
                                value={twitterId}
                                label={t('profile.twitterId')}
                                fullWidth
                                placeholder={t('profile.twitterExampleLabel')}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className={classes.box}>
                            <TextField
                                className={classes.bottomTextSpace}
                                onChange={this.handleInputChange}
                                name="facebookId"
                                value={facebookId}
                                label={t('profile.facebookId')}
                                fullWidth
                                placeholder={t('profile.facebookExampleLabel')}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className={classes.box}>
                            <TextField
                                placeholder={window.location.origin}
                                className={classes.bottomTextSpace}
                                onChange={this.handleInputChange}
                                name="webUrl"
                                value={webUrl}
                                label={t('profile.webUrl')}
                                fullWidth
                                error={!!this.state.errors.get('webUrl')}
                                helperText={this.state.errors.get('webUrl')}
                            />
                        </div>
                        <div className={classes.box}>
                            <DatePicker
                                placeholder={t('profile.chooseBirthday')}
                                selectedDate={selectedBirthday}
                                dateChange={this.handleBirthdayDateChange}
                                fullWidth
                            />
                        </div>
                        <br />
                        <div className={classes.bottomPaperSpace}></div>
                    </DialogContent>
                    <DialogActions className={classes.fixedDownStickyXS}>
                        <Button onClick={this.props.onRequestClose}> {t('profile.cancelButton')} </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleUpdate}
                            className={classes.updateButton}
                        >
                            {' '}
                            {t('profile.updateButton')}{' '}
                        </Button>
                    </DialogActions>
                </MobileDialog>

                {/* Image gallery for banner*/}
                {this.state.openBanner && (
                    <MobileDialog fullWidth open={this.state.openBanner} onClose={this.handleCloseBannerGallery}>
                        <AppDialogTitle
                            title={t('profile.chooseBannerDialogTitle')}
                            onRequestClose={this.handleCloseBannerGallery}
                        />
                        <GalleryComponent
                            set={this.handleRequestSetBanner}
                            folder={config.data.coverFolderPath}
                            images={coverImages}
                            loadData={this.loadCoverList}
                            close={this.handleCloseBannerGallery}
                        />
                    </MobileDialog>
                )}
                <ImageEditor
                    open={isImageEditorOpen}
                    onClose={this.handleCloseImageEditor}
                    onSetUrl={this.handleRequestSetEditedBanner}
                    originalPhotoUrl={originalBanner}
                />

                {/* Image gallery for avatar */}
                {this.state.openAvatar && (
                    <MobileDialog fullWidth open={this.state.openAvatar} onClose={this.handleCloseAvatarGallery}>
                        <AppDialogTitle
                            title={t('profile.chooseAvatarDialogTitle')}
                            onRequestClose={this.handleCloseAvatarGallery}
                        />
                        <GalleryComponent
                            set={this.handleRequestSetAvatar}
                            folder={config.data.avatarFolderPath}
                            images={avatarImages}
                            loadData={this.loadAvatarList}
                            close={this.handleCloseAvatarGallery}
                        />
                    </MobileDialog>
                )}
            </div>
        );
    }
}

export default connectEditProfile(EditProfileComponent);
