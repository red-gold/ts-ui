import { User } from 'core/domain/users';
import { Map } from 'immutable';
import { DialogType } from 'models/common/dialogType';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as globalActions from 'store/actions/globalActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { globalSelector } from 'store/reducers/global/globalSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { ICommentGroupComponentProps } from './ICommentGroupComponentProps';
import { commentActions } from 'store/actions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { userSelector } from 'store/reducers/users/userSelector';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/styles/withStyles/withStyles';
import { commentGroupStyles } from './commentGroupStyles';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: ICommentGroupComponentProps) => {
    return {
        send: (newComment: Map<string, any>) => {
            dispatch(commentActions.dbAddComment(newComment))
        }
    }
}

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser()
    const selectRequest = serverSelector.selectRequest()
    const mapStateToProps = (state: Map<string, any>, ownProps: ICommentGroupComponentProps) => {
        const { postId } = ownProps
        const requestId = StringAPI.createServerRequestId(ServerRequestType.CommentGetComments, postId)
        const currentUser = selectCurrentUser(state)
        const commentsRequestStatus = selectRequest(state, { requestId: requestId })
        
        return {
            commentsRequestStatus: commentsRequestStatus ? commentsRequestStatus.status : ServerRequestStatusType.NoAction,
            uid: currentUser.get('userId', ''),
            avatar: currentUser.get('avatar', ''),
            fullName: currentUser.get('fullName', '')
        }

    }
    return mapStateToProps
}

// - Connect component to redux store
export const connectCommentGroup =
    (component: Component<ICommentGroupComponentProps>) => {
        const translateWrapper = withTranslation('translations')(component as any)
        return connect(makeMapStateToProps, mapDispatchToProps)(withStyles(commentGroupStyles as any)(translateWrapper as any))

    }