import { LanguageType } from 'store/reducers/locale/langugeType'
import { VerificationType } from 'core/domain/authorize/verificationType'
export const environment = {
  firebase: {
    apiKey: "AIzaSyBtlAw6mYUMqaoqIa6WyXoMKWLwhTe7ZK0",
    authDomain: "resume-web-app.firebaseapp.com",
    databaseURL: "https://resume-web-app.firebaseio.com",
    projectId: "resume-web-app",
    storageBucket: "resume-web-app.appspot.com",
    messagingSenderId: "236906995600",
    appId: "1:236906995600:web:17d5a305b14c04082cdd15"
  },
  algolia: {
    appId: 'TOS20M7VT1',
    apiKey: 'c283440030db1f9446e8b410f7352479'
  },
  websocket: {
    url: (window as any).WEBSOCKET_URL || "wss://red-gold-socket.herokuapp.com"
  },
  data: {
    imageFolderPath: 'images',
    avatarFolderPath: 'avatar',
    coverFolderPath: 'cover',
    videoFolderPath: 'videos',
    thumbnailFolderPath: 'thumbnail',
    videoThumbnailPath: 'video_thumbnail',
    locale: 'https://raw.githubusercontent.com/red-gold/react-social-locales/master/src/social'
  },
  dataFormat: {
    postVersion: '1.0.0'
  },
  exteranlSocial: {
    instagramClientId: '04cd49f9331643aeae1ad6df6e2b83f0'
  },
  settings: {
    enabledOAuthLogin: true,
    appName: 'React Social',
    supportEmail: 'amir.gholzam@live.com',
    appIcon: require('assets/images/appIcon.png'),
    logo: require('assets/images/logo.png'),
    defaultLanguage: LanguageType.English,
    defaultVideoThumbnails: require('assets/images/defaultVideoThumbnails.png'),
    verificationType: VerificationType.Email,
    companyName: 'Red Gold',
    defaultProfileCover: require('assets/images/coversocial.png'),
    publicCover: require('assets/images/public-cover.jpg'),
    raisedLogo: require('assets/images/raised-logo.png'),
    loginCover: require('assets/images/login-cover.jpg'),
    signupCover: require('assets/images/signup-cover.jpg'),
    logoHead: require('assets/images/logo-head.png'),
    androidAppLink: 'https://github.com/Qolzam/react-mobile-social',
    iosAppLink: 'https://github.com/Qolzam/react-mobile-social',
    api: '/',
    gateway: 'https://red-gold.o6s.io',
    prettyURL: true,
    maxVideoFileSize: 20,
    maxGalley: 10
  },
  rewrites:{
    "profile": "auth/profile"
  },
  header: {
    title: 'React Social',
    meta: [
      {name: 'description', content: 'The React Social Network is an open source project relying on React a powerful javascript library for building the user interface. In this project, I tried to show some features of react/react components as a social network. The structure of this project give the ability to developer to develop their project on their own idea and environment.' }
    ],

  }
}
