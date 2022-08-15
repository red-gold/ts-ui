import { ICircleService } from 'core/services/circles/ICircleService';
import { Container } from 'inversify';
import { IUserService } from 'core/services/users/IUserService';
import { IUserSettingService } from 'core/services/users/IUserSettingService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { ICommentService } from 'core/services/comments/ICommentService';
import { ICommonService } from 'core/services/common/ICommonService';
import { IImageGalleryService } from 'core/services/imageGallery/IImageGalleryService';
import { INotificationService } from 'core/services/notifications/INotificationService';
import { IPostService } from 'core/services/posts/IPostService';
import { IVoteService } from 'core/services/votes/IVoteService';
import { IUserTieService } from 'core/services/circles/IUserTieService';
import { IPermissionService } from 'core/services/security/IPermissionService';
import { IStorageService } from 'core/services/files/IStorageService';
import { IVangService } from 'core/services/vang/IVangService';
import { GraphService } from './services/graphs/GraphService';
import { IGraphService } from './services/graphs/IGraphService';
import { VoteService } from './services/votes/VoteService';
import { PostService } from './services/posts/PostService';
import { StorageService } from './services/storage/StorageService';
import { CommonService } from './services/common/CommonService';
import { CommentService } from './services/comments/CommentService';
import { UserService } from './services/users/UserService';
import { AuthorizeService } from './services/authorize/AuthorizeService';
import { CircleService } from './services/circles/CircleService';
import { ImageGalleryService } from './services/imageGallery/ImageGalleryService';
import { NotificationService } from './services/notifications/notificationService';
import { OpenFaaSClient } from './openFaaSClientTypes';
import { UserTieService } from './services/circles/UserTieService';
import { UserSettingService } from './services/users/UserSettingService';
import { PermissionService } from './services/security/PermissionService';
import { VangService } from './services/vang/VangService';

/**
 * Register telar microservice dependecies
 */
export const useMicros = (container: Container) => {
    container.bind<IPermissionService>(SocialProviderTypes.PermissionService).to(PermissionService);
    container.bind<IAuthorizeService>(SocialProviderTypes.AuthorizeService).to(AuthorizeService);
    container.bind<ICircleService>(SocialProviderTypes.CircleService).to(CircleService);
    container.bind<ICommentService>(SocialProviderTypes.CommentService).to(CommentService);
    container.bind<ICommonService>(SocialProviderTypes.CommonService).to(CommonService).inSingletonScope();
    container.bind<IImageGalleryService>(SocialProviderTypes.ImageGalleryService).to(ImageGalleryService);
    container.bind<IStorageService>(SocialProviderTypes.StorageService).to(StorageService);
    container.bind<INotificationService>(SocialProviderTypes.NotificationService).to(NotificationService);
    container.bind<IPostService>(SocialProviderTypes.PostService).to(PostService);
    container.bind<IUserService>(SocialProviderTypes.UserService).to(UserService);
    container.bind<IVoteService>(SocialProviderTypes.VoteService).to(VoteService);
    container.bind<IGraphService>(OpenFaaSClient.GraphService).to(GraphService);
    container.bind<IUserTieService>(SocialProviderTypes.UserTieService).to(UserTieService);
    container.bind<IUserSettingService>(SocialProviderTypes.UserSettingService).to(UserSettingService);
    container.bind<IVangService>(SocialProviderTypes.VangService).to(VangService);
};
