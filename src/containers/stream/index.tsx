// - Import react components
import { grey } from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import PostStreamComponent from 'containers/postStream';
import Grid from '@material-ui/core/Grid';

import { connectStream } from './connectStream';
import { IStreamProps } from './IStreamProps';
import { IStreamState } from './IStreamState';
import { streamStyles } from './streamStyles';
import PostWriteButton from 'components/postWriteButton';
import RightPanel from 'components/rightPanel';
import classNames from 'classnames';
import { Hidden } from '@material-ui/core';
export class StreamComponent extends Component<IStreamProps & WithTranslation, IStreamState> {
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
    constructor(props: IStreamProps & WithTranslation) {
        super(props);

        this.state = {};

        // Binding functions to `this`
        this.loadPosts = this.loadPosts.bind(this);
    }
    componentDidMount() {
        const { setHomeTitle, t } = this.props;
        setHomeTitle(t('header.home'));
    }

    /**
     * Load posts
     */
    loadPosts() {
        const { loadStream, page, increasePage } = this.props;
        if (page !== undefined) {
            loadStream(page, 10);
            increasePage();
        }
    }
    /**
     * Reneder component DOM
     *
     */
    render() {
        const { hasMorePosts, posts, requestId, classes, streamRequestStatus } = this.props;

        return (
            <Grid container justify="space-around" spacing={3}>
                <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                    <PostWriteButton displayWriting />
                    <PostStreamComponent
                        requestId={requestId}
                        posts={posts}
                        loadStream={this.loadPosts}
                        hasMorePosts={hasMorePosts}
                        requestStatus={streamRequestStatus}
                    />
                </Grid>
                <Grid className={classes.gridItem} xs={12} md={4} item>
                    <Hidden smDown>
                        <RightPanel />
                    </Hidden>
                </Grid>
            </Grid>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(StreamComponent);

export default withRouter<any, any>(connectStream(withStyles(streamStyles)(translateWrapper as any) as any));
