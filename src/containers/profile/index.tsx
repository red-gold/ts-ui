// - Import react components
import withStyles from '@material-ui/core/styles/withStyles';
import StringAPI from 'api/StringAPI';
import ImgCover from 'components/imgCover';
import UserActivity from 'components/userActivity';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import config from 'config';
import * as postActions from 'store/actions/postActions';
import * as userActions from 'store/actions/userActions';
import { postSelector } from 'store/reducers/posts/postSelector';
import Grid from '@material-ui/core/Grid';

import PostStreamComponent from '../postStream';
import { IProfileComponentProps } from './IProfileComponentProps';
import { IProfileComponentState } from './IProfileComponentState';
import { profileStyles } from './profileStyles';
import * as globalActions from 'store/actions/globalActions';
import { withRouter } from 'react-router-dom';
import { throwNoValue } from 'utils/errorHandling';
import { userGetters } from 'store/reducers/users/userGetters';

// - Material-UI
// - Import app components
// - Import actions
/**
 * Create component class
 */
export class ProfileComponent extends Component<IProfileComponentProps & WithTranslation, IProfileComponentState> {
    historyUnlisten: any = null;
    static propTypes = {};

    /**
     * Component constructor
     *
     */
    constructor(props: IProfileComponentProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    componentDidMount() {
        const { history, users } = this.props;
        this.props.loadUserInfo();
        if (!this.historyUnlisten && users) {
            this.historyUnlisten = history.listen((location: any) => {
                const userId = (location.pathname as string).replace('/', '');
                const displayName = users.getIn([userId, 'fullName'], '');
                this.props.setHeaderTitle(displayName);
            });
        }
        this.props.setHeaderTitle(this.props.name);
    }

    componentWillUnmount() {
        if (this.historyUnlisten) {
            this.historyUnlisten();
        }
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { loadPosts, hasMorePosts, t, classes, profile, isCurrentUser, posts, postRequestId } = this.props;
        const trans = throwNoValue(t, 't');
        return (
            <>
                <div className={classes.bannerContainer}>
                    <ImgCover
                        height={'384px'}
                        width={'100%'}
                        className={classes.banner}
                        src={
                            profile && profile.get('banner')
                                ? profile.get('banner')
                                : config.settings.defaultProfileCover
                        }
                    />
                </div>
                <UserActivity profile={throwNoValue(profile, 'profile')} isCurrentUser={isCurrentUser} />
                <div style={{ height: '24px' }}></div>
                {/* <ProfileAlbumComponent userId={userId} isOwner={isCurrentUser}/> */}
                <div>
                    {!posts.isEmpty() ? (
                        <div className="profile__title">
                            {trans('profile.headPostsLabel', { userName: this.props.name })}
                        </div>
                    ) : (
                        ''
                    )}
                    <div style={{ height: '24px' }}></div>
                    <Grid container justify="center" spacing={3}>
                        <Grid className={classes.gridItem} classes={{ root: classes.postGrid }} xs={12} md={8} item>
                            <PostStreamComponent
                                posts={posts}
                                requestId={postRequestId}
                                loadStream={loadPosts}
                                hasMorePosts={hasMorePosts}
                                displayWriting={false}
                            />
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IProfileComponentProps) => {
    const { userId } = ownProps.match.params;
    return {
        loadPosts: (page: number) => dispatch(postActions.dbGetPostsByUserId(userId, page)),
        loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId, 'header')),
        setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IProfileComponentProps) => {
    const { userId } = ownProps.match.params;
    const postRequestId = StringAPI.createServerRequestId(ServerRequestType.ProfileGetPosts, userId);
    const uid = state.getIn(['authorize', 'uid'], 0);
    const hasMorePosts = state.getIn(['user', 'post', userId, 'hasMoreData'], true);
    const selectProfilePosts = postSelector.selectProfilePosts();
    const posts = selectProfilePosts(state, { userId });

    const userProfile = userGetters.getUserProfileById(state, { userId: userId });
    const users = userGetters.getUsers(state);
    return {
        avatar: userProfile.get('avatar'),
        name: userProfile.get('fullName'),
        banner: userProfile.get('banner'),
        tagLine: userProfile.get('tagLine'),
        userId,
        users,
        posts,
        hasMorePosts,
        postRequestId,
        profile: userProfile,
        isCurrentUser: userId === uid,
    };
};

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(ProfileComponent);

export default withRouter(
    connect<{}, {}, any, any>(
        mapStateToProps,
        mapDispatchToProps,
    )(withStyles(profileStyles as any)(translateWrapper as any) as any) as any,
);
