import CommentComponent from 'components/comment/CommentComponent';
import { Map } from 'immutable';
import React from 'react';

import { ICommentListProps } from './ICommentListProps';

export function CommentListComponent(props: ICommentListProps) {
    const scrollableNodeRef = React.createRef();
    const { comments, editorStatus } = props;

    /**
     * Get comment list elements
     * @returns comment list
     */
    const commentList = () => {
        if (!comments.isEmpty()) {
            const parsedElemetList: any[] = [];
            comments.forEach((comment: Map<string, any>) => {
                parsedElemetList.push(
                    <CommentComponent
                        key={comment.get('objectId')}
                        comment={comment}
                        isPostOwner={props.isPostOwner}
                        disableComments={props.disableComments}
                        editorStatus={editorStatus.get(comment.get('objectId'), false)}
                    />,
                );
            });
            return parsedElemetList;
        }
    };

    React.useEffect(() => {
        const scrollableRoot: any = scrollableNodeRef.current;
        if (scrollableRoot) {
            scrollableRoot.scrollTop = scrollableRoot.scrollHeight;
        }
    }, [comments, scrollableNodeRef]);

    return <>{commentList()}</>;
}

export default CommentListComponent;
