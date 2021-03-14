import { LanguageType } from 'store/reducers/locale/langugeType';
import { VerificationType } from 'core/domain/authorize/verificationType';

export const environment = {
    data: {
        imageFolderPath: 'images',
        videoFolderPath: 'videos',
        avatarFolderPath: 'avatar',
        coverFolderPath: 'cover',
        thumbnailFolderPath: 'thumbnail',
        videoThumbnailPath: 'video_thumbnail',
        locale: 'https://raw.githubusercontent.com/red-gold/react-social-locales/master/src/social',
    },
    dataFormat: {
        postVersion: '1.0.0',
    },
    exteranlSocial: {
        instagramClientId: '1b410d1afea843eeacf00e3507621683',
    },
    settings: {
        appName: process.env.REACT_APP_NAME,
        companyName: process.env.REACT_APP_COMPANY_NAME,
        supportEmail: process.env.REACT_APP_EMAIL_SUPPORT,
        enabledOAuthLogin: true,
        appIcon: require('assets/images/appIcon.png'),
        logo: require('assets/images/logo.png'),
        defaultLanguage: LanguageType.English,
        defaultVideoThumbnails: require('assets/images/defaultVideoThumbnails.png'),
        verificationType: VerificationType.Email,
        defaultProfileCover: require('assets/images/coversocial.png'),
        publicCover: require('assets/images/public-cover.jpg'),
        raisedLogo: require('assets/images/raised-logo.png'),
        loginCover: require('assets/images/login-cover.jpg'),
        signupCover: require('assets/images/signup-cover.jpg'),
        logoHead: require('assets/images/logo-head.png'),
        androidAppLink: 'https://github.com/Qolzam/react-mobile-social',
        iosAppLink: 'https://github.com/Qolzam/react-mobile-social',
        maxVideoFileSize: 20,
        maxGalley: 10,
    },
    gateway: {
        base_route_api: process.env.REACT_APP_BASE_ROUTE_API,
        gateway_url: process.env.REACT_APP_GATEWAY,
        gateway_uri: `${process.env.REACT_APP_GATEWAY}${process.env.REACT_APP_BASE_ROUTE_API}`,
        auth_web_uri: `${process.env.REACT_APP_AUTH_WEB_URI}`,
        websocket_url: 'http://social.example.com:3001',
    },
    rewrites: {
        profile: 'auth/profile',
        my: 'profile/my',
    },
    header: {
        title: 'Telar Social Engine',
        meta: [
            {
                name: 'description',
                content:
                    'The Telar Social Engine is an open source project relying on React a powerful javascript library for building the user interface. In this project, I tried to show some features of react/react components as a social network. The structure of this project give the ability to developer to develop their project on their own idea and environment.',
            },
        ],
    },
};
