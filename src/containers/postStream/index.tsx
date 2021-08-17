import React, { useState } from 'react';
import PostCard from 'components/post/PostCard';
import LoadMoreProgressComponent from 'oldComponents/loadMoreProgress';
import { IPostStreamProps } from './IPostStreamProps';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export function PostStreamComponent(props: IPostStreamProps) {
    const { t } = useTranslation();
    const [nextPage, setNextPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const { hasMorePosts, posts } = props;

    /**
     * Loader
     */
    const loadMore = async () => {
        const { loadStream } = props;
        if (!loading) {
            setLoading(true);
            await loadStream(nextPage);
            setLoading(false);
            setNextPage(nextPage + 1);
        }
    };

    /**
     * Get list of post
     */
    const getpostList = () => {
        const { posts } = props;
        const postListDom: any[] = [];
        (posts || []).forEach((post) => {
            postListDom.push(<PostCard key={`${post.get('id')}-stream-div-post`} post={post as any} />);
        });

        return postListDom;
    };

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMorePosts,
        onLoadMore: loadMore,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: false,
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    });

    return (
        <div>
            {posts && posts.count() > 0 && getpostList()}
            {posts && posts.count() === 0 && !loading && !hasMorePosts && (
                <Typography sx={{ textAlign: 'center' }} variant="subtitle1" color="inherit">
                    {t('profile.nothingToShowLabel')}
                </Typography>
            )}

            {(loading || hasMorePosts) && (
                <div ref={sentryRef}>
                    <LoadMoreProgressComponent key="stream-load-more-progress" />
                </div>
            )}
        </div>
    );
}

// export default PostStreamComponent;
export default React.memo(PostStreamComponent, (props, nextProps) => {
    return (
        nextProps.posts.equals(props.posts) &&
        nextProps.hasMorePosts === props.hasMorePosts &&
        props.requestStatus === nextProps.requestStatus
    );
});
