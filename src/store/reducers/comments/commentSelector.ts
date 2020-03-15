import { PostAPI } from 'api/PostAPI';
import { List, Map } from 'immutable';
import { createSelector } from 'reselect';


/****************************
 * Get from store
 ***************************/
const getPostComments = (state: Map<string, any>, props: { postId: string}) => {
    return state.getIn(['comment', 'postComments', props.postId], Map({}))
}

/****************************
 * Selectors
 ***************************/
const selectPostComments = () => {
    return createSelector(
        [getPostComments],
        (comments) => comments
    )
}

export const commentSelector = {
    getPostComments,
    selectPostComments
}