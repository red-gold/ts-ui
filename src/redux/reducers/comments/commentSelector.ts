import { Map } from 'immutable';
import { createSelector } from 'reselect';

/** **************************
 * Get from store
 ************************** */

const getPostComments = (state: Map<string, any>, props: { postId: string }) => {
    return state.getIn(['comment', 'postComments', props.postId], Map({})) as Map<string, Map<string, any>>;
};

const getEditorStatus = (state: Map<string, any>, props: { postId: string }) => {
    const commentsEditorStatus = state.getIn(['comment', 'editorStatus', props.postId], Map({}));
    return commentsEditorStatus as Map<string, any>;
};

const getHasMoreData = (state: Map<string, any>, props: { postId: string }): boolean => {
    return state.getIn(['comment', 'ui', 'posts', props.postId, 'hasMoreData'], true) as boolean;
};

/** **************************
 * Selectors
 ************************** */

const selectPostComments = () => {
    return createSelector([getPostComments], (comments) => {
        const sortedComments = comments.sortBy((item) => item.get('creationDate'));
        return sortedComments;
    });
};

const selectEditorStatus = () => {
    return createSelector([getEditorStatus], (status) => status);
};

const selectHasMoreData = () => {
    return createSelector([getHasMoreData], (status) => status);
};

export const commentSelector = {
    getPostComments,
    selectPostComments,
    selectEditorStatus,
    selectHasMoreData,
};
