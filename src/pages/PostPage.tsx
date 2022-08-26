import { Map } from 'immutable';
import React, { useEffect, useState } from 'react';
import * as postActions from 'redux/actions/postActions';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

// material
import { CircularProgress, Stack, styled } from '@mui/material';
// redux
import { userSelector } from 'redux/reducers/users/userSelector';
import { postSelector } from 'redux/reducers/posts/postSelector';
//
import PostCard from 'components/post/PostCard';
import { fetchProfileById } from 'redux/actions/userActions';
import { useDispatch, useSelector } from 'redux/store';

// selectors
const selectPost = postSelector.selectPostByURLKeyWithProfile();
const selectProfileById = userSelector.selectUserProfileById();

// ----------------------------------------------------------------------

const LoadingWrapperStyle = styled('div')(() => ({
    textAlign: 'center',
}));

const ContainerStyle = styled('div')(() => ({
    maxWidth: 1200,
    whiteSpace: 'nowrap',
    lineHeight: 0,
    position: 'relative',
    boxPack: 'center',
    WebkitJustifyContent: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '0 auto',
    width: '100%',
    '@media (min-width: 440px)': {
        width: '90%',
    },
    '@media only screen and (min-width: 860px)': {
        width: '90%',
    },
    '@media (min-width: 1600px)': {
        width: '94%',
    },
    '@media (max-width: 440px)': {
        width: 'calc(100% - 16px)',
        margin: '0 8px',
    },
}));

// ----------------------------------------------------------------------

export default function PostPage() {
    const { urlKey } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);

    // Dispatcher
    const dispatch = useDispatch();

    // Selector
    const post = useSelector((state: Map<string, any>) => selectPost(state, { urlKey: urlKey as string }));
    const userInfo = useSelector((state: Map<string, any>) =>
        selectProfileById(state, { userId: post.get('ownerUserId') }),
    );

    const loadPost = async () => {
        setLoading(true);
        try {
            await dispatch<any>(postActions.fetchPostByURLKey(urlKey as string));
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (urlKey) {
            loadPost();
        }
    }, [urlKey, dispatch]);

    useEffect(() => {
        if (post && post.get('ownerUserId')) {
            dispatch<any>(fetchProfileById(post.get('ownerUserId')));
        }
    }, [post.get('ownerUserId'), dispatch]);

    return (
        <ContainerStyle>
            <Stack spacing={3} sx={{ minWidth: { xs: '100%', md: 600 } }}>
                {loading || post.isEmpty() ? (
                    <LoadingWrapperStyle>
                        <CircularProgress sx={{ alignSelf: 'center' }} size={20} />
                    </LoadingWrapperStyle>
                ) : (
                    <PostCard key={`${post.get('id')}-stream-div-post`} post={post} />
                )}
            </Stack>
        </ContainerStyle>
    );
}
