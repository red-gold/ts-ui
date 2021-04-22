// - Import react components
import withStyles from '@material-ui/core/styles/withStyles';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostComponent from 'components/post';
import * as postActions from 'store/actions/postActions';
import * as userActions from 'store/actions/userActions';

import { IPostPageProps } from './IPostPageProps';
import { IPostPageState } from './IPostPageState';
import { postPageStyles } from './postPageStyles';

export class PostPageComponent extends Component<IPostPageProps, IPostPageState> {
    static propTypes = {};

    /**
     * Component constructor
     *
     */
    constructor(props: IPostPageProps) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }
    componentDidMount() {
        const { loadPost, loadUserInfo } = this.props;
        if (loadPost && loadUserInfo) {
            loadPost();
            loadUserInfo();
        }
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { classes, post, userInfo } = this.props;
        if (!userInfo || !post) {
            return <div />;
        }
        return (
            <div className={classes.container}>
                <div className={classes.postBox} key={`post-stream-column-${userInfo.userId}`}>
                    <PostComponent key={`${post.get('id')}-stream-div-post`} post={post} />
                </div>
            </div>
        );
    }
}

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IPostPageProps) => {
    const { userId, postId } = ownProps.match.params;
    return {
        loadPost: () => dispatch(postActions.dbGetPostById(userId, postId)),
        loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId)),
    };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IPostPageProps) => {
    const { userId, postId } = ownProps.match.params;
    const userInfo: Map<string, any> = state.getIn(['state', 'user', 'entities', userId], Map({}));
    const post: Map<string, any> = state.getIn(['post', 'entities', postId], Map({}));
    return {
        userInfo: userInfo.toJS(),
        post,
    };
};

// - Connect component to redux store
export default connect<{}, {}, any, any>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(postPageStyles as any)(PostPageComponent as any) as any);
