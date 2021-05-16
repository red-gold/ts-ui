import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as commentActions from 'store/actions/commentActions';
import * as globalActions from 'store/actions/globalActions';
import * as postActions from 'store/actions/postActions';
import * as voteActions from 'store/actions/voteActions';

import { IDispatchProps, IOwnProps, IPostProps, IStateProps } from './IPostProps';
import { commentSelector } from 'store/reducers/comments/commentSelector';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { postStyles } from './postStyles';
import { DialogType } from 'models/common/dialogType';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IOwnProps) => {
    const { post } = ownProps;
    return {
        vote: () => dispatch(voteActions.dbAddVote(post.get('id'), post.get('ownerUserId'))),
        unvote: () => dispatch(voteActions.dbDeleteVote(post.get('id'), post.get('ownerUserId'))),
        delete: (id: string) => dispatch(postActions.dbDeletePost(id)),
        toggleDisableComments: (status: boolean) => {
            dispatch(postActions.dbUpdatePost(post.set('disableComments', status)));
        },
        toggleSharingComments: (status: boolean) => {
            dispatch(postActions.dbUpdatePost(post.set('disableSharing', status)));
        },
        goTo: (url: string) => {
            location.href = url;
        },
        setHomeTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title || '')),
        getPostComments: (ownerUserId: string, postId: string, page: number, limit: number) =>
            dispatch(commentActions.dbFetchComments(postId, page, limit)),
        setPostWriteModel: (model: Map<string, any>) => dispatch(postActions.setPostWriteModel(model)),
        openPostWrite: () => dispatch(globalActions.openDialog(DialogType.PostWrite)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectComments = commentSelector.selectPostComments();

    const mapStateToProps = (state: Map<string, any>, ownProps: IOwnProps) => {
        const commentList = selectComments(state, { postId: ownProps.post.get('id') });
        const currentUser = selectCurrentUser(state);
        const uid = currentUser.get('userId');

        const voteCount: number = ownProps.post.get('score', 0);
        const currentUserVote: boolean = ownProps.post.getIn(['votes', uid], false);

        return {
            commentList,
            currentUser,
            voteCount,
            currentUserVote,
            isPostOwner: uid === ownProps.post.get('ownerUserId'),
        };
    };
    return mapStateToProps;
};

export const connectPost = (component: React.ComponentType<IPostProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(postStyles)(translateWrapper));
};
