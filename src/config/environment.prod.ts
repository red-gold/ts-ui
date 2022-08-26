import { LanguageType } from 'redux/reducers/locale/langugeType';
import { VerificationType } from 'core/domain/authorize/verificationType';

export const environment = {
    data: {
        imageFolderPath: 'images',
        avatarFolderPath: 'avatar',
        coverFolderPath: 'cover',
        videoFolderPath: 'videos',
        thumbnailFolderPath: 'thumbnail',
        videoThumbnailPath: 'video_thumbnail',
        locale: 'https://raw.githubusercontent.com/red-gold/react-social-locales/master/src/social',
    },
    dataFormat: {
        postVersion: '1.0.0',
    },
    exteranlSocial: {
        instagramClientId: '04cd49f9331643aeae1ad6df6e2b83f0',
    },
    settings: {
        appName: process.env.REACT_APP_NAME,
        companyName: process.env.REACT_APP_COMPANY_NAME,
        supportEmail: process.env.REACT_APP_EMAIL_SUPPORT,
        recaptcha_site_key: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
        enabledOAuthLogin: true,
        appIcon: '',
        logo: '',
        defaultProfileCover: '',
        publicCover: '',
        raisedLogo: '',
        loginCover: '',
        signupCover: '',
        logoHead: '',
        defaultVideoThumbnails: '',
        defaultLanguage: LanguageType.English,
        verificationType: VerificationType.Email,
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
        github_oauth_url: `${process.env.REACT_APP_GITHUB_OAUTH_URL}`,
        websocket_url: `${process.env.REACT_APP_WEBSOCKET_URL}`,
    },
    rewrites: {
        profile: 'auth/profile',
    },
    header: {
        title: 'Telar Social',
        meta: [
            {
                name: 'description',
                content:
                    'The Telar Social is an open source project relying on React a powerful javascript library for building the user interface. In this project, I tried to show some features of react/react components as a social network. The structure of this project give the ability to developer to develop their project on their own idea and environment.',
            },
        ],
    },
};
