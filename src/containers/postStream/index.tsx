// - Import react components
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Map } from 'immutable';
import { WithTranslation, withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router-dom';
import PostComponent from 'components/post';
import LoadMoreProgressComponent from 'layouts/loadMoreProgress';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { connectPostStream } from './connectPostStream';
import { IPostStreamProps } from './IPostStreamProps';
import { IPostStreamState } from './IPostStreamState';
import { postStreamStyles } from './postStreamStyles';

export class PostStreamComponent extends Component<IPostStreamProps & WithTranslation, IPostStreamState> {
    /**
     * Feilds
     */
    nextPage = 0;

    styles = {};

    static getDerivedStateFromProps(nextProps: IPostStreamProps, prevState: IPostStreamState) {
        if (nextProps.posts && nextProps.posts.count() > 0 && !nextProps.posts.equals(prevState.prevPosts)) {
            const posts = nextProps.posts;
            return {
                posts,
                prevPosts: nextProps.posts.count(),
            };
        }
        return null;
    }

    /**
     * Component constructor
     *
     */
    constructor(props: IPostStreamProps & WithTranslation) {
        super(props);

        this.state = {
            /**
             * It's true if we want to have two column of posts
             */
            divided: false,
            /**
             * If it's true comment will be disabled on post
             */
            disableComments: this.props.disableComments || false,
            /**
             * If it's true share will be disabled on post
             */
            disableSharing: this.props.disableSharing || false,
            /**
             * If it's true, post write will be open
             */
            openPostWrite: false,
            /**
             * The title of home header
             */
            homeTitle: props.homeTitle || '',

            /**
             * If there is more post to show {true} or not {false}
             */
            hasMorePosts: true,

            /**
             * List of posts
             */
            posts: Map({}),

            /**
             * Stream length
             */
            prevPosts: Map({}),
        };

        // Binding functions to `this`
        this.loader = this.loader.bind(this);
    }

    /**
     * Loader
     */
    loader = () => {
        const { streamRequestStatus } = this.props;
        const { loadStream } = this.props;
        if (loadStream && streamRequestStatus && streamRequestStatus !== ServerRequestStatusType.Sent) {
            loadStream(this.nextPage);
            this.nextPage++;
        }
    };

    /**
     * Get list of post
     */
    getpostList = () => {
        const { posts } = this.state;
        const postListDom: any[] = [];
        (posts || []).forEach((post) => {
            postListDom.push(<PostComponent key={`${post.get('id')}-stream-div-post`} post={post as any} />);
        });

        return postListDom;
    };

    componentDidMount() {
        setTimeout(() => {
            this.loader();
        }, 500);
    }

    shouldComponentUpdate(newProps: IPostStreamProps) {
        return !newProps.posts.equals(this.props.posts) || newProps.hasMorePosts !== this.props.hasMorePosts;
    }
    /**
     * Reneder component DOM
     *
     */
    render() {
        const { hasMorePosts, posts } = this.props;

        return (
            <>
                <InfiniteScroll
                    dataLength={posts ? posts.size : 0}
                    next={this.loader}
                    hasMore={hasMorePosts || false}
                    endMessage={''}
                    loader={<LoadMoreProgressComponent key="stream-load-more-progress" />}
                >
                    {posts && posts.count() > 0 && this.getpostList()}
                </InfiniteScroll>
            </>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(PostStreamComponent);

export default withRouter<any, any>(
    connectPostStream(withStyles(postStreamStyles as any)(translateWrapper as any) as any),
);
