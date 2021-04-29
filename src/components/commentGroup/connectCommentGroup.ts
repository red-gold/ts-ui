import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { ICommentGroupComponentProps } from './ICommentGroupComponentProps';
import * as commentActions from 'store/actions/commentActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/styles/withStyles/withStyles';
import { commentGroupStyles } from './commentGroupStyles';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        send: (newComment: Map<string, any>) => {
            dispatch(commentActions.dbAddComment(newComment));
        },
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectRequest = serverSelector.selectRequest();
    const mapStateToProps = (state: Map<string, any>, ownProps: ICommentGroupComponentProps) => {
        const { postId } = ownProps;
        const requestId = StringAPI.createServerRequestId(ServerRequestType.CommentGetComments, postId);
        const currentUser = selectCurrentUser(state);
        const commentsRequestStatus = selectRequest(state, { requestId: requestId });

        return {
            commentsRequestStatus: commentsRequestStatus.get('status', ServerRequestStatusType.NoAction),
            uid: currentUser.get('userId', ''),
            avatar: currentUser.get('avatar', ''),
            fullName: currentUser.get('fullName', ''),
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store
export const connectCommentGroup = (component: ComponentType<ICommentGroupComponentProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<{}, {}, any, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(commentGroupStyles as any)(translateWrapper as any));
};
