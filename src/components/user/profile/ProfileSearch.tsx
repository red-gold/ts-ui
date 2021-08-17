import React from 'react';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Grid, CircularProgress } from '@material-ui/core';
import { SxProps } from '@material-ui/system';
//
import useInfiniteScroll from 'react-infinite-scroll-hook';
import SearchNotFound from 'components/SearchNotFound';
import { List, Map } from 'immutable';
import UserCard from 'components/user/UserCard';

// ----------------------------------------------------------------------

const LoadingWrapperStyle = styled('div')(() => ({
    textAlign: 'center',
    marginTop: '1em',
}));

// ----------------------------------------------------------------------

export interface ProfileSearchProps {
    friends: List<Map<string, any>>;
    hasNextPage: boolean;
    loading: boolean;
    loadMore: () => Promise<void>;
    sx?: SxProps;
    query: string;
}

export default function ProfileSearch({ friends, hasNextPage, loading, loadMore, sx, query }: ProfileSearchProps) {
    const [sentryRef] = useInfiniteScroll({
        loading: loading,
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
        <Box sx={{ mt: 5, ...sx }}>
            <Grid container spacing={1}>
                {friends.map((friend) => (
                    <Grid key={friend.get('objectId')} item xs={12} md={4}>
                        <UserCard user={friend} sx={{ p: 2 }} />
                    </Grid>
                ))}
                {friends && friends.size === 0 && !loading && !hasNextPage ? (
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
