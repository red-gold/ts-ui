import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/styles/withStyles/withStyles';
import * as commentActions from 'store/actions/commentActions';
import * as userActions from 'store/actions/userActions';
import { userSelector } from 'store/reducers/users/userSelector';
import { Map } from 'immutable';
import { ICommentComponentProps } from './ICommentComponentProps';
import { commentStyles } from './commentStyles';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: ICommentComponentProps) => {
    return {
        delete: (id: string | null, postId: string) => dispatch(commentActions.dbDeleteComment(id, postId)),
        update: (comment: Map<string, any>) => {
            dispatch(commentActions.dbUpdateComment(comment));
        },
        openEditor: () =>
            dispatch(
                commentActions.openCommentEditor({
                    id: ownProps.comment.get('id', '0'),
                    postId: ownProps.comment.get('postId'),
                }),
            ),
        closeEditor: () =>
            dispatch(
                commentActions.closeCommentEditor(ownProps.comment.get('postId'), ownProps.comment.get('id', '0')),
            ),
        getUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(ownProps.comment.get('ownerUserId', '0'), '')),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectUserProfileById = userSelector.selectUserProfileById();

    const mapStateToProps = (state: Map<string, any>, ownProps: ICommentComponentProps) => {
        const commentOwnerId = ownProps.comment.get('ownerUserId', '0');
        const currentUser = selectCurrentUser(state);
        const uid = currentUser.get('userId', '0');
        return {
            uid,
            avatar: ownProps.comment.get('ownerAvatar', '0'),
            fullName: currentUser.get('ownerDisplayName', 'loading...'),
            isCommentOwner: uid === commentOwnerId,
            commentOwner: selectUserProfileById(state, { userId: commentOwnerId }),
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store

export const connectComment = (component: React.ComponentType<ICommentComponentProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);

    return connect<{}, {}, any, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(commentStyles as any)(translateWrapper as any));
};
