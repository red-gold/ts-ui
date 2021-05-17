import { Map } from 'immutable';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostComponent from 'components/post';
import * as postActions from 'store/actions/postActions';
import { useParams } from 'react-router';
import { userSelector } from 'store/reducers/users/userSelector';
import { postSelector } from 'store/reducers/posts/postSelector';
import { useStyles } from './postPageStyles';

const selectUserProfileById = userSelector.selectUserProfileById();
const selectPost = postSelector.selectPost();

export function PostPageComponent() {
    const { userId, postId } = useParams();
    const classes = useStyles();
    // Dispatcher
    const dispatch = useDispatch();
    const loadPost = () => dispatch(postActions.dbGetPostById(userId, postId));

    // Selector
    const userInfo = useSelector((state: Map<string, any>) => selectUserProfileById(state, { userId }));
    const post = useSelector((state: Map<string, any>) => selectPost(state, { postId }));

    React.useEffect(() => {
        loadPost();
    });

    return (
        <div className={classes.container}>
            <div className={classes.postBox} key={`post-stream-column-${userInfo.get('userId', '')}`}>
                <PostComponent key={`${post.get('id')}-stream-div-post`} post={post} />
            </div>
        </div>
    );
}

export default PostPageComponent;
