import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { styled } from '@mui/material/styles';
import { Box, Grid, CircularProgress } from '@mui/material';
import SearchNotFound from 'components/SearchNotFound';
import { List, Map } from 'immutable';
import PostCard from './PostCard';

// ----------------------------------------------------------------------

const LoadingWrapperStyle = styled('div')(() => ({
    textAlign: 'center',
}));

// ----------------------------------------------------------------------

export interface PostInfinitListProps {
    posts: List<Map<string, any>>;
    hasNextPage: boolean;
    loading: boolean;
    loadMore: () => Promise<void>;
    query: string;
}

export function PostInfinitList({ loadMore, loading, hasNextPage, posts, query }: PostInfinitListProps) {
    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage,
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
        <Box sx={{ mt: 5 }}>
            <Grid container spacing={3} justifyContent="center">
                {posts && posts.size > 0
                    ? posts.map((post) => (
                          <Grid key={post.get('id')} item xs={12} md={8}>
                              <PostCard post={post} />
                          </Grid>
                      ))
                    : undefined}
                {posts && posts.size === 0 && !loading && !hasNextPage ? (
                    <SearchNotFound
                        searchQuery={query}
                        sx={{
                            p: 3,
                            mx: 'auto',
                            width: `calc(100% - 48px)`,
                            bgcolor: 'background.neutral',
                        }}
                    />
                ) : undefined}
            </Grid>
            {loading || hasNextPage ? (
                <LoadingWrapperStyle ref={sentryRef}>
                    <CircularProgress sx={{ alignSelf: 'center' }} size={20} />
                </LoadingWrapperStyle>
            ) : undefined}
        </Box>
    );
}

// export default PostInfinitList;
export default React.memo(PostInfinitList, (props, nextProps) => {
    return (
        nextProps.posts.equals(props.posts) &&
        nextProps.hasNextPage === props.hasNextPage &&
        nextProps.loading === props.loading
    );
});
