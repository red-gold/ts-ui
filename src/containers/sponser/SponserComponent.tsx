import withStyles from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { connectSponser } from './connectSponser';
import { ISponserProps } from './ISponserProps';
import { ISponserState } from './ISponserState';
import { sponserStyles } from './sponserStyles';

export class SponserComponent extends Component<ISponserProps & WithTranslation, ISponserState> {
    /**
     * Fields
     */
    iframeRef: React.RefObject<HTMLIFrameElement>;

    constructor(props: ISponserProps & WithTranslation) {
        super(props);
        this.iframeRef = React.createRef();

        // Defaul state
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        return <div className={classes.root}></div>;
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(SponserComponent);

export default connectSponser(withStyles(sponserStyles as any)(translateWrapper as any) as any);
