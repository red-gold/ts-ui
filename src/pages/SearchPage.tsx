import queryString from 'query-string';
import { AntTab, AntTabs } from 'components/tab';
import { useSnackbar } from 'notistack5';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { postSelector } from 'redux/reducers/posts/postSelector';
import { userSelector } from 'redux/reducers/users/userSelector';
import { useSelector } from 'redux/store';
import { PATH_MAIN } from 'routes/paths';

// actions
import { fetchSearchPosts, resetSearchPost } from 'redux/actions/postActions';
import { fetchUserSearch, resetSearchUser } from 'redux/actions/userActions';
import { setHeaderTitle } from 'redux/actions/globalActions';
import { List, Map } from 'immutable';
import PostSearch from 'components/post/PostSearch';
import ProfileSearch from 'components/user/profile/ProfileSearch';
import { Container } from '@material-ui/core';

// selectors
const selectSearchPeople = userSelector.selectSearchPeople();
const hasMoreProfiles = userSelector.selectMoreSearchPeople();
const selectSearchPosts = postSelector.selectSearchPosts();
const selectHasMorePosts = postSelector.selectHasMorePostSeach();

// ----------------------------------------------------------------------

export default function SearchPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [nextPage, setNextPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const profileSearchResult: List<Map<string, any>> = useSelector(selectSearchPeople);
    const hasNextProfilePage: boolean = useSelector(hasMoreProfiles);
    const postSearchResult: List<Map<string, any>> = useSelector(selectSearchPosts);
    const hasNextPostPage: boolean = useSelector(selectHasMorePosts);
    const { q }: { q: string } = queryString.parse(location.search) as any;

    // Load more posts
    const loadMorePosts = async () => {
        try {
            setLoading(true);
            await dispatch(fetchSearchPosts(q, nextPage, 10));
            setNextPage(nextPage + 1);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };
    const handleCategory = (category: string) => {
        navigate(PATH_MAIN.search.root.replace(':category', `${category}?q=${q}`));
    };

    // Load more profiles
    const loadMoreProfiles = async () => {
        if (!loading) {
            try {
                setLoading(true);
                await dispatch(fetchUserSearch(q, nextPage, 10));
                setNextPage(nextPage + 1);
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        setNextPage(0);
        dispatch(resetSearchUser());
        dispatch(resetSearchPost());
        setLoading(false);
        dispatch(setHeaderTitle(t('search.' + params.category)));
    }, [location, dispatch]);

    /**
     * Hadle on tab change
     */
    const handleChangeTab = (event: any, value: any) => {
        value === 0 ? handleCategory('people') : handleCategory('posts');
    };

    return (
        <Container>
            <AntTabs
                indicatorColor={'secondary'}
                onChange={handleChangeTab}
                value={params.category === 'people' ? 0 : 1}
                centered
                textColor="primary"
            >
                <AntTab label={t('search.people')} />
                <AntTab label={t('search.posts')} />
            </AntTabs>
            <div>
                {params.category === 'people' && (
                    <ProfileSearch
                        friends={profileSearchResult}
                        loadMore={loadMoreProfiles}
                        hasNextPage={hasNextProfilePage}
                        loading={loading}
                        query={q}
                    />
                )}
                {params.category === 'posts' && (
                    <PostSearch
                        posts={postSearchResult}
                        loadMore={loadMorePosts}
                        hasNextPage={hasNextPostPage}
                        loading={loading}
                        query={q}
                    />
                )}
            </div>
        </Container>
    );
}
