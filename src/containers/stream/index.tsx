// - Import react components
import { grey } from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import PostStreamComponent from 'containers/postStream';
import Grid from '@material-ui/core/Grid';

import { connectStream } from './connectStream';
import { IStreamComponentProps } from './IStreamComponentProps';
import { IStreamComponentState } from './IStreamComponentState';
import { streamStyles } from './streamStyles';
import PostWriteButton from 'components/postWriteButton';
import RightPanel from 'components/rightPanel';
import classNames from 'classnames';
export class StreamComponent extends Component<IStreamComponentProps & WithTranslation, IStreamComponentState> {
    styles = {
        postWritePrimaryText: {
            color: grey[400],
            cursor: 'text',
        },
        postWtireItem: {
            fontWeight: '200',
        },
    };

    /**
     * Component constructor
     *
     */
    constructor(props: IStreamComponentProps & WithTranslation) {
        super(props);

        this.state = {};

        // Binding functions to `this`
        this.loadPosts = this.loadPosts.bind(this);
    }
    componentDidMount() {
        const { setHomeTitle, t } = this.props;
        if (setHomeTitle && t) {
            setHomeTitle(t('header.home'));
        }
    }

    /**
     * Load posts
     */
    loadPosts() {
        const { loadStream, page, increasePage } = this.props;
        if (loadStream && page !== undefined && increasePage) {
            loadStream(page);
            increasePage();
        }
    }
    /**
     * Reneder component DOM
     *
     */
    render() {
        const { hasMorePosts, posts, requestId, currentUser, classes } = this.props;

        return (
            <Grid container justify="space-around" spacing={3}>
                <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                    <PostWriteButton displayWriting />
                    <PostStreamComponent
                        homeTitle={currentUser ? currentUser.fullName : ''}
                        requestId={requestId}
                        posts={posts}
                        loadStream={this.loadPosts}
                        hasMorePosts={hasMorePosts}
                        displayWriting
                    />
                </Grid>
                <Grid className={classes.gridItem} xs={12} md={4} item>
                    <RightPanel />
                </Grid>
            </Grid>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(StreamComponent);

export default withRouter<any, any>(connectStream(withStyles(streamStyles)(translateWrapper as any) as any));
