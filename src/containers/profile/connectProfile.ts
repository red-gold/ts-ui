import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as postActions from 'store/actions/postActions';
import * as userActions from 'store/actions/userActions';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { userSelector } from 'store/reducers/users/userSelector';

import { IDispatchProps, IOwnProps, IProfileProps, IStateProps } from './IProfileProps';
import withStyles from '@material-ui/core/styles/withStyles';
import { profileStyles } from './profileStyles';
import { WithTranslation, withTranslation } from 'react-i18next';

const mapDispatchToProps = (dispatch: any, ownProps: IOwnProps) => {
    const { userId } = ownProps.match.params;
    return {
        loadPosts: (page: number) => dispatch(postActions.dbGetPostsByUserId(userId, page)),
        loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId)),
        setHeaderTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title)),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectRequest = serverSelector.selectRequest();
    const selectProfilePosts = postSelector.selectProfilePosts();
    const selectHasMorePostProfile = postSelector.selectHasMorePostProfile();
    const selectUserProfileById = userSelector.selectUserProfileById();

    const mapStateToProps = (state: Map<string, any>, ownProps: IOwnProps) => {
        const { userId } = ownProps.match.params;
        const currentUser = selectCurrentUser(state);
        const currentUserId = currentUser.get('userId');
        const requestId = StringAPI.createServerRequestId(ServerRequestType.ProfileGetPosts, userId);
        const postsRequest = selectRequest(state, { requestId });
        const postsRequestStatus: ServerRequestStatusType = postsRequest.get(
            'status',
            ServerRequestStatusType.NoAction,
        );
        const hasMorePosts: boolean = selectHasMorePostProfile(state, { userId });
        const posts = selectProfilePosts(state, { userId });
        const profile = selectUserProfileById(state, { userId });

        return {
            posts,
            hasMorePosts,
            postsRequestStatus,
            requestId,
            profile,
            isCurrentUser: userId === currentUserId,
        };
    };
    return mapStateToProps;
};

export const connectProfile = (component: React.ComponentType<IProfileProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(profileStyles)(translateWrapper));
};
