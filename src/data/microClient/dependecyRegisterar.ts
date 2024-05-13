import { ICircleService } from 'core/services/circles/ICircleService';
import { Container, decorate, inject, injectable } from 'inversify';
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
import { MicroClient } from './microClientTypes';
import { UserTieService } from './services/circles/UserTieService';
import { UserSettingService } from './services/users/UserSettingService';
import { PermissionService } from './services/security/PermissionService';
import { VangService } from './services/vang/VangService';

/**
 * Register telar microservice dependecies
 */
export const useMicros = (container: Container) => {
    decorateAll();
    bindAll(container);
};

const decorateAll = () => {
    // injectable
    decorate(injectable(), PermissionService);
    decorate(injectable(), AuthorizeService);
    decorate(injectable(), CircleService);
    decorate(injectable(), CommentService);
    decorate(injectable(), CommonService);
    decorate(injectable(), ImageGalleryService);
    decorate(injectable(), StorageService);
    decorate(injectable(), NotificationService);
    decorate(injectable(), PostService);
    decorate(injectable(), UserService);
    decorate(injectable(), VoteService);
    decorate(injectable(), GraphService);
    decorate(injectable(), UserTieService);
    decorate(injectable(), UserSettingService);
    decorate(injectable(), VangService);

    // inject http service for constructor of main services
    decorate(inject(SocialProviderTypes.HttpService), AuthorizeService, 0);
    decorate(inject(SocialProviderTypes.HttpService), VangService, 0);
    decorate(inject(SocialProviderTypes.HttpService), CircleService, 0);
    decorate(inject(SocialProviderTypes.HttpService), UserTieService, 0);
    decorate(inject(SocialProviderTypes.HttpService), CommentService, 0);
    decorate(inject(SocialProviderTypes.HttpService), CommonService, 0);
    decorate(inject(SocialProviderTypes.HttpService), ImageGalleryService, 0);
    decorate(inject(SocialProviderTypes.HttpService), NotificationService, 0);
    decorate(inject(SocialProviderTypes.HttpService), PostService, 0);
    decorate(inject(SocialProviderTypes.HttpService), StorageService, 0);
    decorate(inject(SocialProviderTypes.HttpService), UserService, 0);
    decorate(inject(SocialProviderTypes.HttpService), UserSettingService, 0);
    decorate(inject(SocialProviderTypes.HttpService), VoteService, 0);

    // inject main services constructor
    // ImageGalleryService
    decorate(inject(SocialProviderTypes.StorageService), ImageGalleryService, 1);
    decorate(inject(SocialProviderTypes.PostService), ImageGalleryService, 2);
    // VangService
    decorate(inject(SocialProviderTypes.AuthorizeService), VangService, 1);
};

const bindAll = (container: Container) => {
    container.bind<IAuthorizeService>(SocialProviderTypes.AuthorizeService).to(AuthorizeService);
    container.bind<IPermissionService>(SocialProviderTypes.PermissionService).to(PermissionService);
    container.bind<ICircleService>(SocialProviderTypes.CircleService).to(CircleService);
    container.bind<ICommentService>(SocialProviderTypes.CommentService).to(CommentService);
    container.bind<ICommonService>(SocialProviderTypes.CommonService).to(CommonService).inSingletonScope();
    container.bind<IImageGalleryService>(SocialProviderTypes.ImageGalleryService).to(ImageGalleryService);
    container.bind<IStorageService>(SocialProviderTypes.StorageService).to(StorageService);
    container.bind<INotificationService>(SocialProviderTypes.NotificationService).to(NotificationService);
    container.bind<IPostService>(SocialProviderTypes.PostService).to(PostService);
    container.bind<IUserService>(SocialProviderTypes.UserService).to(UserService);
    container.bind<IVoteService>(SocialProviderTypes.VoteService).to(VoteService);
    container.bind<IGraphService>(MicroClient.GraphService).to(GraphService);
    container.bind<IUserTieService>(SocialProviderTypes.UserTieService).to(UserTieService);
    container.bind<IUserSettingService>(SocialProviderTypes.UserSettingService).to(UserSettingService);
    container.bind<IVangService>(SocialProviderTypes.VangService).to(VangService);
};
